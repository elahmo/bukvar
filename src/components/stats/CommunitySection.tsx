import { CommunityStats, fasterThanPercent } from '../../lib/community'
import { formatTime } from '../../lib/timer'
import {
  COMMUNITY_TITLE,
  COMMUNITY_PLAYED_TEXT,
  COMMUNITY_SOLVE_TIME_TEXT,
  COMMUNITY_AVG_TEXT,
  COMMUNITY_FASTER_TEXT,
  COMMUNITY_TIME_OFF_TEXT,
  COMMUNITY_TRIES_TEXT,
  COMMUNITY_TRIES_HINT,
} from '../../constants/strings'

type Props = {
  community: CommunityStats
  todaySolveTimeMs: number | null
  isTimeTrackingEnabled: boolean
  justFinished: boolean // gate top-guesses (which include answer-adjacent words)
}

const BINS = 16

const Sparkline = ({
  community,
  youSec,
}: {
  community: CommunityStats
  youSec: number | null
}) => {
  const dist = community.solve_time_distribution
  const maxSec = dist.length ? dist[dist.length - 1].sec : 300
  const binW = Math.max(1, Math.ceil(maxSec / BINS))
  const bins = new Array(BINS).fill(0)
  dist.forEach((p) => {
    const b = Math.min(BINS - 1, Math.floor(p.sec / binW))
    bins[b] += p.n
  })
  const maxBin = Math.max(...bins, 1)
  const pos = (sec: number) => Math.min(100, (100 * sec) / (maxSec || 1))

  return (
    <div className="relative my-1">
      <div className="flex items-end gap-px h-12">
        {bins.map((b, i) => (
          <div
            key={i}
            className="flex-1 bg-slate-400 opacity-50 rounded-t-sm"
            style={{ height: `${Math.max(4, (100 * b) / maxBin)}%` }}
          />
        ))}
      </div>
      <div
        className="absolute -top-1 -bottom-1 w-0.5 bg-orange-500 opacity-80"
        style={{ left: `${pos(community.avg_solve_sec)}%` }}
        title={COMMUNITY_AVG_TEXT}
      />
      {youSec != null && (
        <div
          className="absolute -top-1 -bottom-1 w-0.5 bg-blue-600"
          style={{ left: `${pos(youSec)}%` }}
          title="Ti"
        />
      )}
    </div>
  )
}

export const CommunitySection = ({
  community,
  todaySolveTimeMs,
  isTimeTrackingEnabled,
  justFinished,
}: Props) => {
  const youSec =
    isTimeTrackingEnabled && todaySolveTimeMs != null
      ? Math.round(todaySolveTimeMs / 1000)
      : null
  const pct = fasterThanPercent(community, youSec)

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 mt-5 pt-4 dark:text-white">
      <h4 className="text-base font-semibold mb-2">{COMMUNITY_TITLE}</h4>

      <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        <b className="text-gray-900 dark:text-white">{community.players_today}</b>{' '}
        {COMMUNITY_PLAYED_TEXT} · {community.wins_today} ✓ ·{' '}
        {community.losses_today} ✗
      </div>

      <div className="flex items-baseline justify-between text-sm">
        <span>{COMMUNITY_SOLVE_TIME_TEXT}</span>
        <span className="text-gray-500">
          {COMMUNITY_AVG_TEXT}{' '}
          <b className="text-gray-800 dark:text-gray-100">
            {formatTime(community.avg_solve_sec * 1000)}
          </b>
        </span>
      </div>

      <Sparkline community={community} youSec={youSec} />

      <div className="text-center text-sm font-medium text-blue-600 dark:text-blue-300 mt-1">
        {pct != null && todaySolveTimeMs != null ? (
          <>
            Tvoje vrijeme: <b>{formatTime(todaySolveTimeMs)}</b> ·{' '}
            {COMMUNITY_FASTER_TEXT(pct)}
          </>
        ) : (
          <span className="text-gray-500">{COMMUNITY_TIME_OFF_TEXT}</span>
        )}
      </div>

      {justFinished && community.top_guesses.length > 0 && (
        <div className="mt-4">
          <div className="text-sm mb-1">
            {COMMUNITY_TRIES_TEXT}{' '}
            <span className="text-gray-400 text-xs">{COMMUNITY_TRIES_HINT}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {community.top_guesses.map((w) => (
              <span
                key={w.word}
                className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs"
              >
                {w.word} <span className="text-gray-400">{w.n}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
