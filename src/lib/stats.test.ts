import { addStatsForCompletedGame } from './stats'
import { GameStats } from './localStorage'

const emptyStats = (): GameStats => ({
  winDistribution: [0, 0, 0, 0, 0, 0],
  gamesFailed: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalGames: 0,
  successRate: 0,
})

beforeEach(() => {
  localStorage.clear()
})

describe('addStatsForCompletedGame — wins without time', () => {
  test('records a win in the right bucket and updates streaks', () => {
    const stats = addStatsForCompletedGame(emptyStats(), 2)
    expect(stats.totalGames).toBe(1)
    expect(stats.winDistribution[2]).toBe(1)
    expect(stats.currentStreak).toBe(1)
    expect(stats.bestStreak).toBe(1)
    expect(stats.successRate).toBe(100)
  })

  test('a loss (count > 5) resets streak and increments gamesFailed', () => {
    const start = { ...emptyStats(), currentStreak: 3, bestStreak: 3 }
    const stats = addStatsForCompletedGame(start, 6)
    expect(stats.totalGames).toBe(1)
    expect(stats.gamesFailed).toBe(1)
    expect(stats.currentStreak).toBe(0)
    expect(stats.bestStreak).toBe(3)
    expect(stats.successRate).toBe(0)
  })
})

describe('addStatsForCompletedGame — wins with solve time', () => {
  test('first timed win sets best and average to that time', () => {
    const stats = addStatsForCompletedGame(emptyStats(), 3, 45_000)
    expect(stats.timedGames).toBe(1)
    expect(stats.totalTimeMs).toBe(45_000)
    expect(stats.bestTimeMs).toBe(45_000)
  })

  test('subsequent slower win does not update best time', () => {
    let stats = addStatsForCompletedGame(emptyStats(), 3, 45_000)
    stats = addStatsForCompletedGame(stats, 4, 90_000)
    expect(stats.timedGames).toBe(2)
    expect(stats.totalTimeMs).toBe(135_000)
    expect(stats.bestTimeMs).toBe(45_000) // unchanged — 45s still the best
  })

  test('faster subsequent win updates best time', () => {
    let stats = addStatsForCompletedGame(emptyStats(), 3, 60_000)
    stats = addStatsForCompletedGame(stats, 2, 30_000)
    expect(stats.bestTimeMs).toBe(30_000)
    expect(stats.totalTimeMs).toBe(90_000)
    expect(stats.timedGames).toBe(2)
  })

  test('losses with a time do not pollute time stats', () => {
    let stats = addStatsForCompletedGame(emptyStats(), 3, 60_000)
    stats = addStatsForCompletedGame(stats, 6, 120_000)
    expect(stats.timedGames).toBe(1)
    expect(stats.totalTimeMs).toBe(60_000)
    expect(stats.bestTimeMs).toBe(60_000)
  })

  test('wins without a time (null) skip the time fields', () => {
    let stats = addStatsForCompletedGame(emptyStats(), 3, 45_000)
    stats = addStatsForCompletedGame(stats, 4, null)
    expect(stats.timedGames).toBe(1)
    expect(stats.totalTimeMs).toBe(45_000)
    expect(stats.bestTimeMs).toBe(45_000)
    expect(stats.totalGames).toBe(2)
  })

  test('ignores zero or negative solve times', () => {
    const stats = addStatsForCompletedGame(emptyStats(), 3, 0)
    expect(stats.timedGames).toBeUndefined()
    expect(stats.bestTimeMs).toBeUndefined()
  })
})
