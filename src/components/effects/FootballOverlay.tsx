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

type PitchProps = {
  isDarkMode: boolean
}

// A very subtle, static football pitch painted as the page background during
// the World Cup window. We set it on document.body (the page "canvas") rather
// than a position:fixed overlay: on iOS Safari a fixed full-screen layer leaves
// a stale-colored band in the dynamic-toolbar gap at the bottom of the screen
// (it only repaints once something else on the page does). A canvas background
// has no compositing layer, always paints, and fills the whole viewport — so no
// band. It carries no animation, so it's fine under prefers-reduced-motion.
// Colors flip with the theme, just like SnowfallOverlay.
// Builds the body-background CSS for the pitch. Exported so the styling logic
// (theme colors, markings) can be unit-tested without a real CSSOM — jsdom
// silently drops complex multi-layer background-image values.
export const buildPitchStyle = (isDarkMode: boolean) => {
  const line = isDarkMode ? 'rgba(255,255,255,0.14)' : 'rgba(20,83,45,0.16)'
  const grass = isDarkMode ? 'rgba(74,222,128,0.035)' : 'rgba(34,139,34,0.05)'

  // Pitch markings as an inline SVG; encoded into a data: URI so it can be a
  // background-image. The pitch is drawn VERTICALLY (portrait): the goal /
  // penalty boxes sit at the top and bottom and the halfway line runs across the
  // middle. We stretch it to fill the viewport (preserveAspectRatio="none" +
  // background-size:100% 100%) so the field's width always matches the screen
  // and BOTH goals stay on-screen — even on narrow phones, where the old
  // landscape pitch (cover) cropped the left/right goals out of view. The
  // trade-off is the centre circle renders as an ellipse on non-square screens,
  // which is imperceptible at these faint opacities.
  const svg = [
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 680 1050' preserveAspectRatio='none'>`,
    `<g fill='none' stroke='${line}' stroke-width='2'>`,
    `<rect x='20' y='20' width='640' height='1010'/>`,
    `<line x1='20' y1='525' x2='660' y2='525'/>`,
    `<circle cx='340' cy='525' r='90'/>`,
    `<rect x='180' y='20' width='320' height='150'/>`,
    `<rect x='260' y='20' width='160' height='55'/>`,
    `<rect x='180' y='880' width='320' height='150'/>`,
    `<rect x='260' y='975' width='160' height='55'/>`,
    `</g>`,
    `<circle cx='340' cy='525' r='4' fill='${line}'/>`,
    `</svg>`,
  ].join('')

  const pitch = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  // faint "mown grass" stripes — horizontal bands, across the vertical pitch
  const stripes = `repeating-linear-gradient(0deg, transparent 0 70px, ${grass} 70px 140px)`

  return {
    backgroundImage: `${pitch}, ${stripes}`,
    backgroundSize: '100% 100%, auto',
    backgroundPosition: 'center, top left',
    backgroundRepeat: 'no-repeat, repeat',
  }
}

export const FootballPitchBackground = ({ isDarkMode }: PitchProps) => {
  useEffect(() => {
    const next = buildPitchStyle(isDarkMode)
    const body = document.body
    const prev = {
      backgroundImage: body.style.backgroundImage,
      backgroundSize: body.style.backgroundSize,
      backgroundPosition: body.style.backgroundPosition,
      backgroundRepeat: body.style.backgroundRepeat,
    }

    body.style.backgroundImage = next.backgroundImage
    body.style.backgroundSize = next.backgroundSize
    body.style.backgroundPosition = next.backgroundPosition
    body.style.backgroundRepeat = next.backgroundRepeat

    return () => {
      body.style.backgroundImage = prev.backgroundImage
      body.style.backgroundSize = prev.backgroundSize
      body.style.backgroundPosition = prev.backgroundPosition
      body.style.backgroundRepeat = prev.backgroundRepeat
    }
  }, [isDarkMode])

  return null
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
        // NB: intentionally no `will-change: transform` here — leaving it on a
        // position:fixed element permanently triggers an iOS Safari repaint
        // glitch (a stale band near the bottom toolbar). The rAF loop only runs
        // while the ball moves, so the transform is composited fine without it.
        filter: 'drop-shadow(0 4px 5px rgba(0,0,0,0.35))',
      }}
    >
      ⚽
    </div>
  )
}
