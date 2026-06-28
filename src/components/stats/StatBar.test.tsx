import { render, screen } from '@testing-library/react'
import { StatBar } from './StatBar'
import { GameStats } from '../../lib/localStorage'
import {
  BEST_TIME_TEXT,
  AVG_TIME_TEXT,
  TODAY_TIME_TEXT,
} from '../../constants/strings'

const baseStats: GameStats = {
  winDistribution: [0, 0, 0, 0, 0, 0],
  gamesFailed: 0,
  currentStreak: 3,
  bestStreak: 5,
  totalGames: 10,
  successRate: 80,
}

describe('StatBar — time row visibility', () => {
  test('hides the time row when no timed games have been recorded', () => {
    render(<StatBar gameStats={baseStats} isTimeTrackingEnabled={true} todaySolveTimeMs={null} />)
    expect(screen.queryByText(BEST_TIME_TEXT)).not.toBeInTheDocument()
    expect(screen.queryByText(AVG_TIME_TEXT)).not.toBeInTheDocument()
  })

  test('shows the time row when time tracking is on and at least one timed game exists', () => {
    const stats: GameStats = {
      ...baseStats,
      bestTimeMs: 45_000,
      totalTimeMs: 120_000,
      timedGames: 2,
    }
    render(<StatBar gameStats={stats} isTimeTrackingEnabled={true} todaySolveTimeMs={null} />)
    expect(screen.getByText(BEST_TIME_TEXT)).toBeInTheDocument()
    expect(screen.getByText(AVG_TIME_TEXT)).toBeInTheDocument()
    expect(screen.getByText('0:45')).toBeInTheDocument() // best
    expect(screen.getByText('1:00')).toBeInTheDocument() // avg = 120/2 = 60s
  })

  test("shows today's solve time alongside best/avg when provided", () => {
    const stats: GameStats = {
      ...baseStats,
      bestTimeMs: 45_000,
      totalTimeMs: 120_000,
      timedGames: 2,
    }
    render(
      <StatBar
        gameStats={stats}
        isTimeTrackingEnabled={true}
        todaySolveTimeMs={83_000}
      />
    )
    expect(screen.getByText(TODAY_TIME_TEXT)).toBeInTheDocument()
    expect(screen.getByText('1:23')).toBeInTheDocument() // 83s today
    expect(screen.getByText(BEST_TIME_TEXT)).toBeInTheDocument()
    expect(screen.getByText(AVG_TIME_TEXT)).toBeInTheDocument()
  })

  test('hides the time row when time tracking is off even if old stats data exists', () => {
    const stats: GameStats = {
      ...baseStats,
      bestTimeMs: 45_000,
      totalTimeMs: 120_000,
      timedGames: 2,
    }
    render(<StatBar gameStats={stats} isTimeTrackingEnabled={false} todaySolveTimeMs={null} />)
    expect(screen.queryByText(BEST_TIME_TEXT)).not.toBeInTheDocument()
    expect(screen.queryByText(AVG_TIME_TEXT)).not.toBeInTheDocument()
  })

  test('always shows the non-time stats row', () => {
    render(<StatBar gameStats={baseStats} isTimeTrackingEnabled={false} todaySolveTimeMs={null} />)
    expect(screen.getByText('Ukupno pokušaja')).toBeInTheDocument()
    expect(screen.getByText('Najbolji niz')).toBeInTheDocument()
  })
})
