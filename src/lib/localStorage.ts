const gameStateKey = 'gameState'

type StoredGameState = {
  guesses: string[]
  solution: string
}

export const saveGameStateToLocalStorage = (gameState: StoredGameState) => {
  localStorage.setItem(gameStateKey, JSON.stringify(gameState))
}

export const loadGameStateFromLocalStorage = () => {
  const state = localStorage.getItem(gameStateKey)
  return state ? (JSON.parse(state) as StoredGameState) : null
}

const gameStatKey = 'gameStats'

export type GameStats = {
  winDistribution: number[]
  gamesFailed: number
  currentStreak: number
  bestStreak: number
  totalGames: number
  successRate: number
  bestTimeMs?: number
  totalTimeMs?: number
  timedGames?: number
}

export const saveStatsToLocalStorage = (gameStats: GameStats) => {
  localStorage.setItem(gameStatKey, JSON.stringify(gameStats))
}

export const loadStatsFromLocalStorage = () => {
  const stats = localStorage.getItem(gameStatKey)
  return stats ? (JSON.parse(stats) as GameStats) : null
}

const timeTrackingPreferenceKey = 'timeTrackingPreference'

export type TimeTrackingPreference = 'on' | 'off'

export const saveTimeTrackingPreferenceToLocalStorage = (
  preference: TimeTrackingPreference
) => {
  localStorage.setItem(timeTrackingPreferenceKey, JSON.stringify(preference))
}

export const loadTimeTrackingPreferenceFromLocalStorage =
  (): TimeTrackingPreference | null => {
    const raw = localStorage.getItem(timeTrackingPreferenceKey)
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw) as unknown
      return parsed === 'on' || parsed === 'off' ? parsed : null
    } catch {
      return null
    }
  }
