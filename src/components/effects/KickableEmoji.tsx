import { useEffect, useRef, useState } from 'react'

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

interface KickableEmojiProps {
  /** The emoji to render as the toy (e.g. '⚽', '🎂'). */
  emoji: string
  /** Stable test id / hook for the element. */
  testId: string
  /** Radius in px; the element is a 2R square. */
  radius?: number
  /** Emoji font size in px. */
  fontSize?: number
  /** Which corner the toy rests in before its intro drop. */
  startCorner?: 'top-left' | 'top-right'
  /** Intro fling velocity (px/s) applied once on load so visitors notice it. */
  introVx?: number
  introVy?: number
  /** Delay before the intro fling. */
  introDelayMs?: number
}

// A single draggable/kickable emoji with a lightweight rAF physics loop
// (gravity, wall bounce, friction, spin). The animation loop SLEEPS the moment
// the toy comes to rest, so it costs nothing while idle. Hidden entirely for
// users who prefer reduced motion. Originally the World Cup football; extracted
// so the birthday cake (and any future toy) can reuse the exact same physics.
export const KickableEmoji = ({
  emoji,
  testId,
  radius = 18,
  fontSize = 34,
  startCorner = 'top-right',
  introVx = -160,
  introVy = 40,
  introDelayMs = 800,
}: KickableEmojiProps) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const ballRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion) return
    const ball = ballRef.current
    if (!ball) return

    const R = radius // element is 2R square
    const G = 1900 // gravity (px/s^2)
    const E = 0.72 // restitution / bounciness
    const GROUND_FRICTION = 0.86 // horizontal damping on each floor contact
    const AIR = 0.999 // mild air drag per frame
    const SLEEP_SPEED = 6 // below this (on the floor) the loop stops

    let W = window.innerWidth
    let H = window.innerHeight
    const margin = 28
    // center position; start tucked into a top corner
    let x = startCorner === 'top-left' ? R + margin : W - R - margin
    let y = R + margin
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

    // a gentle hello: let the toy drop in once on load so visitors notice it's
    // there (and that it's grabbable) without it roaming the page.
    const introTimer = window.setTimeout(() => {
      vx = introVx
      vy = introVy
      wake()
    }, introDelayMs)

    return () => {
      window.clearTimeout(introTimer)
      if (raf != null) cancelAnimationFrame(raf)
      ball.removeEventListener('pointerdown', onPointerDown)
      ball.removeEventListener('pointermove', onPointerMove)
      ball.removeEventListener('pointerup', release)
      ball.removeEventListener('pointercancel', release)
      window.removeEventListener('resize', onResize)
    }
  }, [
    prefersReducedMotion,
    radius,
    startCorner,
    introVx,
    introVy,
    introDelayMs,
  ])

  if (prefersReducedMotion) return null

  const size = radius * 2

  return (
    <div
      ref={ballRef}
      className="football-ball"
      data-testid={testId}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 5, // BaseModal uses z-10; keep the toy under modals like the snow.
        width: size,
        height: size,
        fontSize,
        lineHeight: `${size}px`,
        textAlign: 'center',
        touchAction: 'none',
        userSelect: 'none',
        // NB: intentionally no `will-change: transform` here — leaving it on a
        // position:fixed element permanently triggers an iOS Safari repaint
        // glitch (a stale band near the bottom toolbar). The rAF loop only runs
        // while the toy moves, so the transform is composited fine without it.
        filter: 'drop-shadow(0 4px 5px rgba(0,0,0,0.35))',
      }}
    >
      {emoji}
    </div>
  )
}
