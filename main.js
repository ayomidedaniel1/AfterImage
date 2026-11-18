import {
  BoxGeometry, BufferGeometry, CanvasTexture, Color, ConeGeometry, EdgesGeometry,
  Grabbed, GrabSystem, Group, Line, LineBasicMaterial, LineSegments, Mesh,
  MeshBasicMaterial, OctahedronGeometry, OneHandGrabbable, PlaneGeometry,
  Quaternion, Vector3, World
} from '@iwsdk/core'
import { ids, rounds, Session, sessionScore, tray, tutorialGoal, tutorialStart } from './game.js'

const status = document.querySelector('#status')
const enter = document.querySelector('#enter')

function outline(geometry, color) {
  return new LineSegments(new EdgesGeometry(geometry), new LineBasicMaterial({ color }))
}

function textPanel(width, height, background) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 160
  const ctx = canvas.getContext('2d')
  const texture = new CanvasTexture(canvas)
  const mesh = new Mesh(new PlaneGeometry(width, height),
    new MeshBasicMaterial({ map: texture, transparent: true }))
  function write(value) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (background) {
      ctx.fillStyle = background
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    ctx.font = background ? 'bold 114px sans-serif' : '54px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#fff6e1'
    ctx.fillText(value, 512, 80, 1000)
    texture.needsUpdate = true
  }
  return { mesh, write }
}

async function start() {
  const world = await World.create(document.querySelector('#scene'), {
    xr: { offer: 'none', features: { handTracking: { required: true } } },
    features: { grabbing: { useHandPinchForGrab: true } },
    render: { near: 0.02, camera: { position: [0, 0, 0] } }
  })
  world.scene.background = new Color(0x101925)
  const board = new Group()
  const root = world.createTransformEntity(board)
  const grab = world.getSystem(GrabSystem)
  const shapes = [new OctahedronGeometry(0.03), new BoxGeometry(0.041, 0.041, 0.041),
    new ConeGeometry(0.03, 0.055, 4)]
  const colors = [0xffc978, 0x80d5ef, 0xeab1fa]
  const stars = ids.map((id, index) => {
    const shape = shapes[index]
    const color = colors[index]
    const mesh = new Mesh(shape, new MeshBasicMaterial({ color }))
    mesh.add(outline(shape, 0x526072))
    const entity = world.createTransformEntity(mesh, root)
    entity.addComponent(OneHandGrabbable, { rotate: false })
    // Only the draggable instance participates in SDK pointer picking.
    const display = mesh.clone()
    const goal = outline(shape, color)
    goal.scale.setScalar(1.1)
    const line = new Line(new BufferGeometry().setFromPoints([new Vector3(), new Vector3()]),
      new LineBasicMaterial({ color }))
    line.frustumCulled = false
    board.add(display, goal, line)
    return { id, mesh, entity, display, goal, line, color, holder: null }
  })
  board.add(outline(new BoxGeometry(0.36, 0.22, 0.16), 0x476178))
  const label = textPanel(0.46, 0.067)
  label.mesh.position.y = 0.155
  board.add(label.mesh)
  function message(value) {
    if (status.textContent === value) return
    label.write(value)
    status.textContent = value
  }

  // Pinching this fixed handle uses the same SDK interaction learned in the tutorial.
  const button = new Mesh(new BoxGeometry(0.14, 0.045, 0.022),
    new MeshBasicMaterial({ color: 0x35626a }))
  button.position.set(0, -0.155, 0.065)
  const buttonEntity = world.createTransformEntity(button, root)
  buttonEntity.addComponent(OneHandGrabbable, { rotate: false, translate: false })
  const caption = textPanel(0.13, 0.034, '#35626a')
  caption.mesh.position.z = 0.012
  button.add(caption.mesh)

  let game = new Session()
  let anchored = false
  let previousTime = null
  let buttonHeld = false
  let actionAfter = 0
  function showInstruction() {
    const { phase, round, remaining, scores } = game
    if (phase === 'tutorial') message('Pinch the star. Move it into the outline.')
    if (phase === 'observe') message('Round ' + (round + 1) + ' · Remember each star · ' + Math.ceil(remaining / 1000))
    if (phase === 'rebuild') message('Rebuild the constellation. Pinch Check.')
    if (phase === 'reveal') message('Round ' + (round + 1) + ' accuracy · ' + scores[round] + '%')
    if (phase === 'results') message('Final accuracy · ' + sessionScore(scores) + '%')
  }
  function present() {
    const { phase, round } = game
    const tutorial = phase === 'tutorial'
    for (const star of stars) {
      const { id, entity, mesh, display, goal, line } = star
      grab.forceRelease(entity)
      star.holder = null
      mesh.material.color.setHex(star.color)
      mesh.visible = phase === 'rebuild' || (tutorial && id === ids[0])
      display.visible = phase === 'observe' || phase === 'reveal'
      goal.visible = phase === 'reveal' || (tutorial && mesh.visible)
      line.visible = phase === 'reveal'
      goal.position.fromArray(tutorial ? tutorialGoal : rounds[round][id])
      if (mesh.visible) mesh.position.fromArray(tutorial ? tutorialStart : tray[id])
      if (phase === 'observe') display.position.copy(goal.position)
      if (phase === 'reveal') {
        display.position.copy(mesh.position)
        const points = line.geometry.attributes.position
        points.setXYZ(0, mesh.position.x, mesh.position.y, mesh.position.z)
        points.setXYZ(1, goal.position.x, goal.position.y, goal.position.z)
        points.needsUpdate = true
      }
    }
    button.visible = ['rebuild', 'reveal', 'results'].includes(phase)
    actionAfter = performance.now() + 350
    if (phase === 'rebuild') caption.write('Check')
    if (phase === 'reveal') caption.write('Next')
    if (phase === 'results') caption.write('Play again')
    showInstruction()
  }
  function press() {
    if (game.phase === 'rebuild') {
      const placements = Object.fromEntries(stars.map(s => [s.id, s.mesh.position.toArray()]))
      if (game.check(placements)) present()
    } else if (game.phase === 'reveal' && game.observe()) present()
    else if (game.phase === 'results' && game.replay()) present()
  }
  function cancelHold(star) {
    grab.forceRelease(star.entity)
    star.mesh.position.fromArray(game.phase === 'tutorial' ? tutorialStart : tray[star.id])
    star.mesh.material.color.setHex(star.color)
    star.holder = null
  }
  present()
  board.position.set(0, -0.04, -0.72)
  const tracked = new Set()
  const armed = new Set()
  let paused = false
  function pauseInput() {
    if (paused) return
    paused = true
    previousTime = null
    armed.clear()
    for (const star of stars) {
      if (star.holder || grab.getHolderHand(star.entity)) cancelHold(star)
    }
    grab.forceRelease(buttonEntity)
    buttonHeld = true
    message('Bring your hands into view.')
  }
  world.onXRFrame(frame => {
    const space = world.xrReferenceSpace
    if (!space || frame.session.visibilityState !== 'visible') {
      pauseInput()
      return
    }
    const pose = frame.getViewerPose(space)
    if (!pose) {
      pauseInput()
      return
    }
    if (!anchored) {
      const { position, orientation } = pose.transform
      const forward = new Vector3(0, 0, -1).applyQuaternion(new Quaternion().copy(orientation))
      board.rotation.y = Math.atan2(-forward.x, -forward.z)
      board.position.set(0, -0.16, -0.42).applyQuaternion(board.quaternion).add(position)
      anchored = true
      present()
    }
    tracked.clear()
    for (const source of frame.session.inputSources) {
      const wrist = source.hand?.get('wrist')
      if (wrist && frame.getJointPose(wrist, space)) tracked.add(source.handedness)
    }
    if (!tracked.size) {
      pauseInput()
      return
    }
    if (paused) {
      paused = false
      showInstruction()
    }
    for (const hand of armed) {
      if (!tracked.has(hand)) armed.delete(hand)
    }
    for (const hand of tracked) {
      if (!world.input.xr.getSelectState(hand).active) armed.add(hand)
    }
    const now = performance.now()
    for (const star of stars) {
      if (star.holder && !tracked.has(star.holder)) {
        cancelHold(star)
        actionAfter = now + 350
        message('Star returned. Try again.')
      }
    }
    const elapsed = previousTime === null ? 0 : now - previousTime
    previousTime = now
    if (game.phase === 'observe') {
      if (game.tick(elapsed)) present()
      else showInstruction()
    }
    for (const star of stars) {
      if (!star.mesh.visible) continue
      const holder = grab.getHolderHand(star.entity)
      if (holder && !armed.has(holder)) {
        cancelHold(star)
      } else if (holder) {
        if (!star.holder) message('Open your fingers to release.')
        star.holder = holder
        star.mesh.material.color.setHex(0xffffff)
      } else if (star.holder) {
        star.holder = null
        actionAfter = now + 350
        star.mesh.material.color.setHex(star.color)
        const { x, y, z } = star.mesh.position
        if (Math.abs(x) > 0.22 || Math.abs(y) > 0.13 || Math.abs(z) > 0.12) {
          cancelHold(star)
          message('Star returned. Try again.')
        } else if (game.phase === 'tutorial' && star.mesh.position.distanceTo(star.goal.position) <= 0.05) {
          game.observe()
          present()
          break
        } else {
          message(game.phase === 'tutorial' ? 'Try the outline.' : 'Rebuild the constellation. Pinch Check.')
        }
      }
    }
    const down = buttonEntity.hasComponent(Grabbed)
    if (button.visible && down && !buttonHeld && now >= actionAfter &&
        armed.has(grab.getHolderHand(buttonEntity)) && !stars.some(s => s.holder)) press()
    buttonHeld = down
  })
  world.renderer.xr.addEventListener('sessionstart', () => {
    const session = world.renderer.xr.getSession()
    session?.addEventListener('visibilitychange', () => {
      previousTime = null
      if (session.visibilityState !== 'visible') pauseInput()
    })
  })
  world.renderer.xr.addEventListener('sessionend', () => {
    anchored = buttonHeld = false
    paused = false
    armed.clear()
    previousTime = null
    grab.forceRelease(buttonEntity)
    board.position.set(0, -0.04, -0.72)
    board.rotation.y = 0
    game = new Session()
    present()
    message('Ready for hand tracking.')
  })
  const supported = await navigator.xr?.isSessionSupported('immersive-vr')
  message(supported ? 'Ready for hand tracking.' : 'Desktop preview. Open in Quest Browser to play with hands.')
  enter.disabled = !supported
  enter.onclick = () => {
    world.launchXR()
    const check = () => {
      if (world.sessionRequestPending) setTimeout(check, 100)
      else if (!world.session) message('VR could not start. Enable hand tracking and try again.')
    }
    check()
  }
}

start().catch(error => {
  status.textContent = 'Scene could not load. Check WebGL support and reload.'
  console.error(error)
})

