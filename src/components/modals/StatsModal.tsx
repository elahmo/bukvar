import Countdown from 'react-countdown'
import { StatBar } from '../stats/StatBar'
import { Histogram } from '../stats/Histogram'
import { CommunitySection } from '../stats/CommunitySection'
import { GameStats } from '../../lib/localStorage'
import { CommunityStats } from '../../lib/community'
import { shareStatus } from '../../lib/share'
import { tomorrow } from '../../lib/words'
import { BaseModal } from './BaseModal'
import {
  STATISTICS_TITLE,
  GUESS_DISTRIBUTION_TEXT,
  NEW_WORD_TEXT,
  SHARE_TEXT,
  COMMUNITY_LEGEND_YOU,
  COMMUNITY_LEGEND_TODAY,
  COMMUNITY_LEGEND_ALL,
} from '../../constants/strings'

type Props = {
  isOpen: boolean
  handleClose: () => void
  guesses: string[]
  gameStats: GameStats
  isGameLost: boolean
  isGameWon: boolean
  todaySolveTimeMs: number | null
  isTimeTrackingEnabled: boolean
  community: CommunityStats | null
  handleShare: () => void
}

const Legend = () => (
  <div className="flex gap-3 justify-end mt-1 text-[11px] text-gray-500 dark:text-gray-400">
    <span className="flex items-center gap-1">
      <span className="inline-block w-3 h-3 rounded-full bg-blue-600" />{' '}
      {COMMUNITY_LEGEND_YOU}
    </span>
    <span className="flex items-center gap-1">
      <span className="inline-block w-3 h-3 rounded-full bg-orange-500" />{' '}
      {COMMUNITY_LEGEND_TODAY}
    </span>
    <span className="flex items-center gap-1">
      <span className="inline-block w-3 h-3 rounded-full bg-slate-400 opacity-60" />{' '}
      {COMMUNITY_LEGEND_ALL}
    </span>
  </div>
)

export const StatsModal = ({
  isOpen,
  handleClose,
  guesses,
  gameStats,
  isGameLost,
  isGameWon,
  todaySolveTimeMs,
  isTimeTrackingEnabled,
  community,
  handleShare,
}: Props) => {
  const justFinished = isGameWon || isGameLost
  // guesses includes the winning word, so its length is the guess count (1..6);
  // the matching row (0-indexed) gets the orange "you, today" highlight.
  const highlightIndex =
    community && isGameWon ? guesses.length - 1 : undefined

  if (gameStats.totalGames <= 0) {
    return (
      <BaseModal
        title={STATISTICS_TITLE}
        isOpen={isOpen}
        handleClose={handleClose}
      >
        <StatBar
          gameStats={gameStats}
          isTimeTrackingEnabled={isTimeTrackingEnabled}
          todaySolveTimeMs={todaySolveTimeMs}
        />
        {community && (
          <CommunitySection
            community={community}
            todaySolveTimeMs={todaySolveTimeMs}
            isTimeTrackingEnabled={isTimeTrackingEnabled}
            justFinished={justFinished}
          />
        )}
      </BaseModal>
    )
  }
  return (
    <BaseModal title={STATISTICS_TITLE} isOpen={isOpen} handleClose={handleClose}>
      <StatBar
        gameStats={gameStats}
        isTimeTrackingEnabled={isTimeTrackingEnabled}
        todaySolveTimeMs={todaySolveTimeMs}
      />
      <h4 className="text-base leading-5 font-medium text-gray-900 dark:text-gray-100">
        {GUESS_DISTRIBUTION_TEXT}
      </h4>
      <Histogram
        gameStats={gameStats}
        community={community}
        highlightIndex={highlightIndex}
      />
      {community && <Legend />}
      {(isGameLost || isGameWon) && (
        <>
          <div className="mt-2 columns-2 dark:text-white">
            <div>
              <h5>{NEW_WORD_TEXT}</h5>
              <Countdown
                className="text-lg font-medium text-gray-900 dark:text-gray-100"
                date={tomorrow}
                daysInHours={true}
              />
            </div>
            <button
              type="button"
              className="mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              onClick={() => {
                shareStatus(guesses, isGameLost, todaySolveTimeMs)
                handleShare()
              }}
            >
              {SHARE_TEXT}
            </button>
          </div>
        </>
      )}
      {community && (
        <CommunitySection
          community={community}
          todaySolveTimeMs={todaySolveTimeMs}
          isTimeTrackingEnabled={isTimeTrackingEnabled}
          justFinished={justFinished}
        />
      )}
    </BaseModal>
  )
}
