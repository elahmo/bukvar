import { GameStats } from '../../lib/localStorage'
import { CommunityStats, communityGuessCounts } from '../../lib/community'
import { Progress } from './Progress'

type Props = {
  gameStats: GameStats
  community?: CommunityStats | null
  highlightIndex?: number // 0..5 — today's winning guess row, highlighted orange
}

export const Histogram = ({ gameStats, community, highlightIndex }: Props) => {
  const yourDist = gameStats.winDistribution
  const yourTotal = yourDist.reduce((a, b) => a + b, 0) || 1
  const yourPct = yourDist.map((v) => (100 * v) / yourTotal)

  const commCounts = community ? communityGuessCounts(community) : null
  const commTotal = commCounts ? commCounts.reduce((a, b) => a + b, 0) || 1 : 1
  const commPct = commCounts ? commCounts.map((v) => (100 * v) / commTotal) : null

  // Normalise both distributions to % of their own total, then scale to the
  // shared max so your bars and the community ghost bars are comparable.
  // (With no community data this collapses to the original per-row scaling.)
  const maxPct = Math.max(...yourPct, ...(commPct ?? [0]), 1)

  return (
    <div className="columns-1 justify-left m-2 text-sm dark:text-white">
      {yourDist.map((value, i) => (
        <Progress
          key={i}
          index={i}
          size={90 * (yourPct[i] / maxPct)}
          ghostSize={commPct ? 90 * (commPct[i] / maxPct) : undefined}
          highlight={highlightIndex === i}
          label={String(value)}
        />
      ))}
    </div>
  )
}
