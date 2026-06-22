import { useEffect, useMemo, useRef, useState } from 'react'

// Mirrors the hook in SnowfallOverlay: respect the user's motion preference and
// react to changes at runtime.
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

type PitchProps = {
  isDarkMode: boolean
}

// A very subtle, static football pitch drawn behind the board. It carries no
// animation, so it's safe to show even under prefers-reduced-motion. It sits at
// z-index -1 (above the page background, below the game UI) and never
// intercepts pointer input. Colors flip with the theme, just like SnowfallOverlay.
export const FootballPitchBackground = ({ isDarkMode }: PitchProps) => {
  const line = isDarkMode ? 'rgba(255,255,255,0.55)' : 'rgba(20,83,45,0.6)'
  const grass = isDarkMode ? 'rgba(74,222,128,0.035)' : 'rgba(34,139,34,0.05)'

  const containerStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      pointerEvents: 'none',
      // faint "mown grass" stripes
      backgroundImage: `repeating-linear-gradient(90deg, transparent 0 70px, ${grass} 70px 140px)`,
    }),
    [grass]
  )

  return (
    <div style={containerStyle} aria-hidden="true">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1050 680"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke={line}
        strokeWidth="2"
        style={{ opacity: 0.16 }}
      >
        {/* touchlines */}
        <rect x="20" y="20" width="1010" height="640" />
        {/* halfway line */}
        <line x1="525" y1="20" x2="525" y2="660" />
        {/* center circle + spot */}
        <circle cx="525" cy="340" r="90" />
        <circle cx="525" cy="340" r="4" fill={line} stroke="none" />
        {/* left penalty area + six-yard box */}
        <rect x="20" y="180" width="150" height="320" />
        <rect x="20" y="260" width="55" height="160" />
        {/* right penalty area + six-yard box */}
        <rect x="880" y="180" width="150" height="320" />
        <rect x="975" y="260" width="55" height="160" />
      </svg>
    </div>
  )
}

// The kickable football: a single draggable element with lightweight rAF
// physics (gravity, wall bounce, friction, spin). The animation loop SLEEPS the
// moment the ball comes to rest, so it costs nothing while idle. Hidden
// entirely for users who prefer reduced motion.
export const FootballOverlay = () => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const ballRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion) return
    const ball = ballRef.current
    if (!ball) return

    const R = 18 // ball radius (px); element is 2R square
    const G = 1900 // gravity (px/s^2)
    const E = 0.72 // restitution / bounciness
    const GROUND_FRICTION = 0.86 // horizontal damping on each floor contact
    const AIR = 0.999 // mild air drag per frame
    const SLEEP_SPEED = 6 // below this (on the floor) the loop stops

    let W = window.innerWidth
    let H = window.innerHeight
    let x = W - R - 28 // center position; start tucked into the top-right
    let y = R + 28
    let vx = 0
    let vy = 0
    let ang = 0
    let dragging = false
    let raf: number | null = null
    let lastT = 0
    let px = 0 // pointer tracking, for computing fling velocity
    let py = 0
    let pt = 0

    const draw = () => {
      ball.style.transform = `translate(${x - R}px, ${
        y - R
      }px) rotate(${ang}deg)`
    }

    const step = (t: number) => {
      if (!lastT) lastT = t
      const dt = Math.min((t - lastT) / 1000, 0.032)
      lastT = t

      if (!dragging) {
        vy += G * dt
        vx *= AIR
        vy *= AIR
        x += vx * dt
        y += vy * dt
        ang += (vx / R) * (180 / Math.PI) * dt // roll spin from horizontal speed

        if (x < R) {
          x = R
          vx = -vx * E
        } else if (x > W - R) {
          x = W - R
          vx = -vx * E
        }
        if (y < R) {
          y = R
          vy = -vy * E
        } else if (y > H - R) {
          y = H - R
          vy = -vy * E
          vx *= GROUND_FRICTION
          if (Math.abs(vy) < 40) vy = 0
        }
      }
      draw()

      const onGround = y >= H - R - 0.5
      const asleep =
        onGround && Math.abs(vx) < SLEEP_SPEED && Math.abs(vy) < SLEEP_SPEED
      if (dragging || !asleep) {
        raf = requestAnimationFrame(step)
      } else {
        // come to rest: stop the loop entirely so there's zero idle cost
        raf = null
        lastT = 0
        vx = 0
        vy = 0
      }
    }

    const wake = () => {
      if (raf == null) {
        lastT = 0
        raf = requestAnimationFrame(step)
      }
    }

    const onResize = () => {
      W = window.innerWidth
      H = window.innerHeight
      x = Math.min(x, W - R)
      y = Math.min(y, H - R)
      wake()
    }

    const onPointerDown = (e: PointerEvent) => {
      dragging = true
      vx = 0
      vy = 0
      ball.classList.add('is-grabbing')
      ball.setPointerCapture(e.pointerId)
      px = e.clientX
      py = e.clientY
      pt = e.timeStamp
      wake()
      e.preventDefault()
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const nx = e.clientX
      const ny = e.clientY
      const dt = (e.timeStamp - pt) / 1000
      if (dt > 0) {
        const cap = 2600 // clamp fling speed
        vx = Math.max(-cap, Math.min(cap, (nx - px) / dt))
        vy = Math.max(-cap, Math.min(cap, (ny - py) / dt))
      }
      x = Math.max(R, Math.min(W - R, nx))
      y = Math.max(R, Math.min(H - R, ny))
      px = nx
      py = ny
      pt = e.timeStamp
      ang += 4
      draw()
    }

    const release = () => {
      if (!dragging) return
      dragging = false
      ball.classList.remove('is-grabbing')
      wake()
    }

    draw()
    ball.addEventListener('pointerdown', onPointerDown)
    ball.addEventListener('pointermove', onPointerMove)
    ball.addEventListener('pointerup', release)
    ball.addEventListener('pointercancel', release)
    window.addEventListener('resize', onResize)

    // a gentle hello: let the ball drop in once on load so visitors notice it's
    // there (and that it's grabbable) without it roaming the page.
    const introTimer = window.setTimeout(() => {
      vx = -160
      vy = 40
      wake()
    }, 800)

    return () => {
      window.clearTimeout(introTimer)
      if (raf != null) cancelAnimationFrame(raf)
      ball.removeEventListener('pointerdown', onPointerDown)
      ball.removeEventListener('pointermove', onPointerMove)
      ball.removeEventListener('pointerup', release)
      ball.removeEventListener('pointercancel', release)
      window.removeEventListener('resize', onResize)
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) return null

  return (
    <div
      ref={ballRef}
      className="football-ball"
      data-testid="football"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 5, // BaseModal uses z-10; keep the ball under modals like the snow.
        width: 36,
        height: 36,
        fontSize: 34,
        lineHeight: '36px',
        textAlign: 'center',
        touchAction: 'none',
        userSelect: 'none',
        willChange: 'transform',
        filter: 'drop-shadow(0 4px 5px rgba(0,0,0,0.35))',
      }}
    >
      ⚽
    </div>
  )
}
