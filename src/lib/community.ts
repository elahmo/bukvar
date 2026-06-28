// Community stats come from the `forms` backend, which proxies our self-hosted
// Plausible (the API key stays on that server, never in this bundle).
// Endpoint: GET https://forms.novalic.xyz/stats/today

const STATS_URL = 'https://forms.novalic.xyz/stats/today'

export type SecCount = { sec: number; n: number }
export type WordCount = { word: string; n: number }

export type CommunityStats = {
  date: string
  players_today: number
  wins_today: number
  losses_today: number
  guess_distribution: { [guesses: string]: number } // keys "1".."6"
  avg_solve_sec: number
  timed_wins_today: number
  solve_time_distribution: SecCount[]
  top_guesses: WordCount[]
}

export const fetchCommunityStats = async (): Promise<CommunityStats | null> => {
  try {
    const res = await fetch(STATS_URL)
    if (!res.ok) return null
    const json = await res.json()
    return (json?.data as CommunityStats) ?? null
  } catch {
    // Network/CORS/parse error — the UI degrades gracefully (no community block).
    return null
  }
}

// Percentage of today's *timed* winners you were faster than (0..100), or null
// when time tracking is off or there's no time data yet.
export const fasterThanPercent = (
  stats: CommunityStats,
  solveTimeSec: number | null
): number | null => {
  if (solveTimeSec == null || !stats.timed_wins_today) return null
  let slower = 0
  for (const p of stats.solve_time_distribution) {
    if (p.sec > solveTimeSec) slower += p.n
  }
  return Math.round((100 * slower) / stats.timed_wins_today)
}

// Community guess distribution as counts indexed 0..5 (i.e. 1..6 guesses),
// matching the shape of GameStats.winDistribution.
export const communityGuessCounts = (stats: CommunityStats): number[] =>
  [1, 2, 3, 4, 5, 6].map((k) => stats.guess_distribution[String(k)] ?? 0)
