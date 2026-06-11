import {
  GameStats,
  loadStatsFromLocalStorage,
  saveStatsToLocalStorage,
} from './localStorage'

// In stats array elements 0-5 are successes in 1-6 trys

export const addStatsForCompletedGame = (
  gameStats: GameStats,
  count: number,
  solveTimeMs: number | null = null
) => {
  // Count is number of incorrect guesses before end.
  // Copy the array too — a shallow spread would let the increment below
  // mutate the winDistribution still referenced by React state.
  const stats = {
    ...gameStats,
    winDistribution: [...gameStats.winDistribution],
  }

  stats.totalGames += 1

  if (count > 5) {
    // A fail situation
    stats.currentStreak = 0
    stats.gamesFailed += 1
  } else {
    stats.winDistribution[count] += 1
    stats.currentStreak += 1

    if (stats.bestStreak < stats.currentStreak) {
      stats.bestStreak = stats.currentStreak
    }

    if (solveTimeMs !== null && solveTimeMs > 0) {
      const timedGames = (stats.timedGames ?? 0) + 1
      const totalTimeMs = (stats.totalTimeMs ?? 0) + solveTimeMs
      const bestTimeMs =
        stats.bestTimeMs === undefined || solveTimeMs < stats.bestTimeMs
          ? solveTimeMs
          : stats.bestTimeMs
      stats.timedGames = timedGames
      stats.totalTimeMs = totalTimeMs
      stats.bestTimeMs = bestTimeMs
    }
  }

  stats.successRate = getSuccessRate(stats)

  saveStatsToLocalStorage(stats)
  return stats
}

const defaultStats: GameStats = {
  winDistribution: [0, 0, 0, 0, 0, 0],
  gamesFailed: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalGames: 0,
  successRate: 0,
}

export const loadStats = () => {
  return loadStatsFromLocalStorage() || defaultStats
}

const getSuccessRate = (gameStats: GameStats) => {
  const { totalGames, gamesFailed } = gameStats

  return Math.round(
    (100 * (totalGames - gamesFailed)) / Math.max(totalGames, 1)
  )
}
