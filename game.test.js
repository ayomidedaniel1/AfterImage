import assert from 'node:assert/strict'
import test from 'node:test'
import { ids, observeMs, rounds, roundScore, Session, sessionScore, tolerance } from './game.js'

const zero = Object.fromEntries(ids.map(id => [id, [0, 0, 0]]))
for (const [error, expected] of [[0, 100], [tolerance / 2, 50], [tolerance, 0], [1, 0]]) {
  test('error ' + error + ' m gives ' + expected + '%', () => {
    const placed = Object.fromEntries(ids.map(id => [id, [0, 0, error]]))
    assert.equal(roundScore(placed, zero), expected)
  })
}
test('matching uses identity even with coincident swapped positions', () => {
  const targets = { diamond: [-0.1, 0, 0], cube: [0.1, 0, 0], pyramid: [0, 0, 0] }
  const swapped = { cube: targets.diamond, pyramid: targets.pyramid, diamond: targets.cube }
  assert.equal(roundScore(swapped, targets), 33)
})
test('rounds advance once, active duration is additive and replay clears the session', () => {
  const s = new Session()
  assert.equal(s.check(zero), false)
  assert.equal(s.replay(), false)
  s.observe()
  for (let i = 0; i < rounds.length; i++) {
    assert.equal(s.round, i)
    assert.equal(s.observe(), false)
    assert.equal(s.tick(observeMs - 1), false)
    assert.equal(s.tick(1), true)
    assert.equal(s.observe(), false)
    assert.equal(s.check(rounds[i]), true)
    assert.equal(s.check(zero), false)
    assert.equal(s.tick(10000), false)
    s.observe()
  }
  assert.deepEqual(s.scores, [100, 100, 100])
  assert.equal(s.phase, 'results')
  assert.equal(s.observe(), false)
  assert.equal(sessionScore([100, 0, 33]), 44)
  assert.equal(s.replay(), true)
  assert.deepEqual(s, new Session())
})
