import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { chromium, expect } from '@playwright/test'
import { preview } from 'vite'
import { ids, tray, rounds, roundScore, sessionScore } from './game.js'

// Serve the actual production artifact. The emulator is injected only into this test browser.
const temp = await mkdtemp(join(tmpdir(), 'afterimage-tls-'))
let server
let browser
try {
  const openssl = process.env.OPENSSL_BIN ?? (process.platform === 'win32'
    ? join(process.env.ProgramFiles, 'Git/usr/bin/openssl.exe') : 'openssl')
  const cert = join(temp, 'cert.pem')
  const key = join(temp, 'key.pem')
  execFileSync(openssl, ['req', '-x509', '-newkey', 'rsa:2048', '-nodes',
    '-subj', '/CN=localhost', '-days', '1', '-keyout', key, '-out', cert], { stdio: 'pipe' })
  server = await preview({ preview: { host: '127.0.0.1', port: 0,
    https: { cert: await readFile(cert), key: await readFile(key) } } })
  browser = await chromium.launch({
    channel: 'msedge', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  })
  const page = await browser.newPage({ ignoreHTTPSErrors: true, viewport: { width: 800, height: 600 } })
  const errors = []
  page.on('pageerror', error => { errors.push(error.message); console.error(error) })
  const url = 'https://127.0.0.1:' + server.httpServer.address().port
  await page.goto(url)
  await expect(page.locator('#status')).toContainText('Desktop preview', { timeout: 30000 })
  await expect(page.locator('#enter')).toBeDisabled()
  const emulator = await readFile('node_modules/iwer/build/iwer.min.js', 'utf8')
  await page.addInitScript({ content: emulator + `
    window.device = new IWER.XRDevice(IWER.metaQuest3)
    device.primaryInputMode = 'hand'
    device.installRuntime({ forceInstall: true })
  ` })
  await page.reload()
  await page.getByRole('button', { name: 'Enter VR' }).click()
  const status = page.locator('#status')
  await expect(status).toHaveText('Pinch the star. Move it into the outline.', { timeout: 30000 })
  async function placeGrip(x, y, z, hand = 'right') {
    await page.evaluate(([x, y, z, hand]) => {
      const head = device.position
      device.hands[hand].setPin({ anchor: 'grip', target: [head.x + x, head.y + y, head.z + z] })
    }, [x, y, z, hand])
    await page.evaluate(() => new Promise(resolve => {
      const ticks = n => requestAnimationFrame(() => n ? ticks(n - 1) : resolve())
      ticks(6)
    }))
  }
  await placeGrip(-0.085, -0.20, -0.40)
  await page.evaluate(() => device.hands.right.updatePinchValue(1))
  await expect(status).toHaveText('Open your fingers to release.', { timeout: 15000 })
  await placeGrip(0.085, -0.12, -0.445)
  // Losing the pinching hand over the tutorial goal must not complete the tutorial.
  await page.evaluate(() => { device.hands.right.connected = false })
  await expect(status).toHaveText('Star returned. Try again.')
  await page.evaluate(() => {
    device.hands.right.updatePinchValue(0)
    device.hands.right.connected = true
  })
  await placeGrip(-0.085, -0.20, -0.40)
  await page.evaluate(() => device.hands.right.updatePinchValue(1))
  await expect(status).toContainText('Open your fingers')
  await placeGrip(0.085, -0.12, -0.445)
  await visibility('hidden')
  await page.evaluate(() => device.hands.right.updatePinchValue(0))
  await visibility('visible')
  await expect(status).toHaveText('Pinch the star. Move it into the outline.')
  await placeGrip(-0.085, -0.20, -0.40)
  await page.evaluate(() => device.hands.right.updatePinchValue(1))
  await expect(status).toContainText('Open your fingers')
  await placeGrip(0.085, -0.12, -0.445)
  await page.evaluate(() => device.hands.right.updatePinchValue(0))
  for (let round = 1; round <= 3; round++) {
    await expect(status).toContainText('Round ' + round + ' · Remember', { timeout: 15000 })
    if (round === 1) {
      await visibility('hidden')
      await page.waitForTimeout(5500)
      await visibility('visible')
      await expect(status).toContainText('Round 1 · Remember')
    }
    if (round === 2) {
      await page.evaluate(() => { device.hands.left.connected = device.hands.right.connected = false })
      await expect(status).toHaveText('Bring your hands into view.')
      await page.waitForTimeout(5500)
      await page.evaluate(() => { device.hands.left.connected = device.hands.right.connected = true })
      await expect(status).toContainText('Round 2 · Remember')
    }
    await expect(status).toContainText('Pinch Check', { timeout: 15000 })
    if (round === 1) {
      // Move each distinct shape to its own authored target in board-local meters.
      for (const id of ids) {
        const [x, y, z] = tray[id]
        await placeGrip(x, y - 0.16, z - 0.42)
        await page.evaluate(() => device.hands.right.updatePinchValue(1))
        await expect(status).toContainText('Open your fingers')
        const [tx, ty, tz] = rounds[0][id]
        await placeGrip(tx, ty - 0.16, tz - 0.42)
        await page.evaluate(() => device.hands.right.updatePinchValue(0))
        await expect(status).toContainText('Pinch Check')
      }
    }
    await pinchButton()
    await expect(status).toContainText('Round ' + round + ' accuracy')
    const expected = round === 1 ? 100 : roundScore(tray, rounds[round - 1])
    await expect(status).toContainText(expected + '%')
    await pinchButton()
  }
  await expect(status).toHaveText('Final accuracy · ' +
    sessionScore([100, roundScore(tray, rounds[1]), roundScore(tray, rounds[2])]) + '%')
  await pinchButton()
  await expect(status).toHaveText('Pinch the star. Move it into the outline.')
  await placeGrip(-0.085, -0.20, -0.40, 'left')
  await page.evaluate(() => device.hands.left.updatePinchValue(1))
  await expect(status).toContainText('Open your fingers')
  await placeGrip(-0.31, -0.20, -0.40, 'left')
  await page.evaluate(() => device.hands.left.updatePinchValue(0))
  await expect(status).toHaveText('Star returned. Try again.')
  await placeGrip(-0.085, -0.20, -0.40, 'left')
  await page.evaluate(() => device.hands.left.updatePinchValue(1))
  await expect(status).toContainText('Open your fingers')
  await placeGrip(0.085, -0.12, -0.445, 'left')
  await page.evaluate(() => device.hands.left.updatePinchValue(0))
  await expect(status).toContainText('Round 1 · Remember')
  await page.evaluate(() => device.activeSession.end())
  await expect(status).toHaveText('Ready for hand tracking.')
  await page.getByRole('button', { name: 'Enter VR' }).click()
  await expect(status).toHaveText('Pinch the star. Move it into the outline.')
  async function visibility(state) {
    await page.evaluate(state => device.updateVisibilityState(state), state)
    await page.waitForFunction(state => device.activeSession.visibilityState === state, state)
  }
  async function pinchButton() {
    await placeGrip(0, -0.315, -0.355)
    await page.waitForTimeout(450)
    await page.evaluate(() => device.hands.right.updatePinchValue(1))
    // Keep the pinch across the label change. A held Check must not also activate Next.
    await page.waitForTimeout(550)
    await page.evaluate(() => device.hands.right.updatePinchValue(0))
    await page.waitForTimeout(150)
  }
  expect(errors).toEqual([])
  console.log('PASS: local HTTPS production build, desktop fallback, immersive session, emulated tutorial, three placements, three round scores, final average and playable replay.')
} finally {
  await browser?.close()
  await server?.close()
  await rm(temp, { recursive: true, force: true })
}


