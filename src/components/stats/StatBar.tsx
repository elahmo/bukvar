import { GameStats } from '../../lib/localStorage'
import { formatTime } from '../../lib/timer'
import {
  TOTAL_TRIES_TEXT,
  SUCCESS_RATE_TEXT,
  CURRENT_STREAK_TEXT,
  BEST_STREAK_TEXT,
  BEST_TIME_TEXT,
  AVG_TIME_TEXT,
} from '../../constants/strings'

type Props = {
  gameStats: GameStats
  isTimeTrackingEnabled: boolean
}

const StatItem = ({
  label,
  value,
}: {
  label: string
  value: string | number
}) => {
  return (
    <div className="items-center justify-center m-1 w-1/4 dark:text-white">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  )
}

export const StatBar = ({ gameStats, isTimeTrackingEnabled }: Props) => {
  const timedGames = gameStats.timedGames ?? 0
  const hasTimes = timedGames > 0
  const avgTimeMs =
    hasTimes && gameStats.totalTimeMs !== undefined
      ? Math.round(gameStats.totalTimeMs / timedGames)
      : 0

  return (
    <>
      <div className="flex justify-center my-2">
        <StatItem label={TOTAL_TRIES_TEXT} value={gameStats.totalGames} />
        <StatItem
          label={SUCCESS_RATE_TEXT}
          value={`${gameStats.successRate}%`}
        />
        <StatItem label={CURRENT_STREAK_TEXT} value={gameStats.currentStreak} />
        <StatItem label={BEST_STREAK_TEXT} value={gameStats.bestStreak} />
      </div>
      {isTimeTrackingEnabled && hasTimes && gameStats.bestTimeMs !== undefined && (
        <div className="flex justify-center gap-x-6 my-2">
          <StatItem
            label={BEST_TIME_TEXT}
            value={formatTime(gameStats.bestTimeMs)}
          />
          <StatItem label={AVG_TIME_TEXT} value={formatTime(avgTimeMs)} />
        </div>
      )}
    </>
  )
}
