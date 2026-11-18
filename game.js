export const ids = ['diamond', 'cube', 'pyramid']
export const tray = {
  diamond: [-0.10, -0.075, 0.05], cube: [0, -0.075, 0.05], pyramid: [0.10, -0.075, 0.05]
}
export const tutorialStart = [-0.085, -0.04, 0.02]
export const tutorialGoal = [0.085, 0.04, -0.025]
export const rounds = [
  { diamond: [-0.105, 0.048, -0.04], cube: [0.015, -0.022, 0.042], pyramid: [0.115, 0.065, 0] },
  { diamond: [0.095, -0.035, 0.048], cube: [-0.105, 0.03, -0.03], pyramid: [0, 0.078, 0.022] },
  { diamond: [0, 0.055, -0.05], cube: [0.115, -0.04, 0.044], pyramid: [-0.105, -0.012, 0.005] }
]
export const observeMs = 5000
export const tolerance = 0.15

export function roundScore(placements, targets) {
  let total = 0
  for (const id of ids) {
    const [x, y, z] = placements[id]
    const [tx, ty, tz] = targets[id]
    const error = Math.hypot(x - tx, y - ty, z - tz)
    total += Math.max(0, 1 - error / tolerance)
  }
  return Math.round(100 * total / ids.length)
}

export function sessionScore(scores) {
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
}

export class Session {
  phase = 'tutorial'
  round = 0
  scores = []
  remaining = 0

  observe() {
    if (this.phase !== 'tutorial' && this.phase !== 'reveal') return false
    if (this.phase === 'reveal') {
      if (this.round === rounds.length - 1) {
        this.phase = 'results'
        return true
      }
      this.round++
    }
    this.phase = 'observe'
    this.remaining = observeMs
    return true
  }

  tick(elapsedMs) {
    if (this.phase !== 'observe') return false
    this.remaining = Math.max(0, this.remaining - Math.max(0, elapsedMs))
    if (this.remaining > 0) return false
    this.phase = 'rebuild'
    return true
  }

  check(placements) {
    if (this.phase !== 'rebuild') return false
    this.scores.push(roundScore(placements, rounds[this.round]))
    this.phase = 'reveal'
    return true
  }

  replay() {
    if (this.phase !== 'results') return false
    Object.assign(this, new Session())
    return true
  }
}
