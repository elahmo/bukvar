import Snowfall from 'react-snowfall'
import { useEffect, useMemo, useState } from 'react'

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(mediaQuery.matches)
    update()

    // Safari < 14 fallback
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update)
      return () => mediaQuery.removeEventListener('change', update)
    }

    mediaQuery.addListener(update)
    return () => mediaQuery.removeListener(update)
  }, [])

  return prefersReducedMotion
}

type Props = {
  isDarkMode: boolean
}

export const SnowfallOverlay = ({ isDarkMode }: Props) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  const color = isDarkMode
    ? 'rgba(255,255,255,0.9)'
    : 'rgba(140,170,200,0.7)' // bluish-gray for visibility on light backgrounds

  const style = useMemo<React.CSSProperties>(
    () => ({
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 5, // BaseModal uses z-10; keep snow under modals.
    }),
    []
  )

  if (prefersReducedMotion) return null

  return (
    <Snowfall
      color={color}
      snowflakeCount={200}
      speed={[0.5, 1.4]}
      wind={[-0.3, 0.6]}
      radius={[0.6, 2.2]}
      opacity={[0.05, 0.55]}
      style={style}
    />
  )
}
