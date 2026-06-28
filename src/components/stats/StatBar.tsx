import { GameStats } from '../../lib/localStorage'
import { formatTime } from '../../lib/timer'
import {
  TOTAL_TRIES_TEXT,
  SUCCESS_RATE_TEXT,
  CURRENT_STREAK_TEXT,
  BEST_STREAK_TEXT,
  TODAY_TIME_TEXT,
  BEST_TIME_TEXT,
  AVG_TIME_TEXT,
} from '../../constants/strings'

type Props = {
  gameStats: GameStats
  isTimeTrackingEnabled: boolean
  todaySolveTimeMs: number | null
}

const StatItem = ({
  label,
  value,
}: {
  label: string
  value: string | number
}) => {
  return (
    <div className="w-1/4 px-1 text-center dark:text-white">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-[11px] leading-tight">{label}</div>
    </div>
  )
}

// Time stats sit in their own row, separated by thin vertical rules so the
// values don't crowd each other.
const TimeStat = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="px-4 text-center dark:text-white">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-[11px] leading-tight">{label}</div>
    </div>
  )
}

export const StatBar = ({
  gameStats,
  isTimeTrackingEnabled,
  todaySolveTimeMs,
}: Props) => {
  const timedGames = gameStats.timedGames ?? 0
  const hasTimes = timedGames > 0
  const avgTimeMs =
    hasTimes && gameStats.totalTimeMs !== undefined
      ? Math.round(gameStats.totalTimeMs / timedGames)
      : 0
  const showBestAvg = hasTimes && gameStats.bestTimeMs !== undefined
  const showTimeRow =
    isTimeTrackingEnabled && (todaySolveTimeMs !== null || showBestAvg)

  return (
    <>
      <div className="flex justify-center my-1 divide-x divide-gray-300 dark:divide-gray-600">
        <StatItem label={TOTAL_TRIES_TEXT} value={gameStats.totalGames} />
        <StatItem
          label={SUCCESS_RATE_TEXT}
          value={`${gameStats.successRate}%`}
        />
        <StatItem label={CURRENT_STREAK_TEXT} value={gameStats.currentStreak} />
        <StatItem label={BEST_STREAK_TEXT} value={gameStats.bestStreak} />
      </div>
      {showTimeRow && (
        <div className="flex justify-center items-center my-1 divide-x divide-gray-300 dark:divide-gray-600">
          {todaySolveTimeMs !== null && (
            <TimeStat
              label={TODAY_TIME_TEXT}
              value={formatTime(todaySolveTimeMs)}
            />
          )}
          {showBestAvg && gameStats.bestTimeMs !== undefined && (
            <TimeStat
              label={BEST_TIME_TEXT}
              value={formatTime(gameStats.bestTimeMs)}
            />
          )}
          {showBestAvg && (
            <TimeStat label={AVG_TIME_TEXT} value={formatTime(avgTimeMs)} />
          )}
        </div>
      )}
    </>
  )
}
