import { useEffect, useRef, useState } from 'react'

// Mirrors the hook in FootballOverlay/SnowfallOverlay: respect the user's motion
// preference and react to changes at runtime.
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

// Flag of Bosna i Hercegovina, weighted toward blue / yellow / white so the
// confetti reads as the flag rather than generic party colours.
const COLORS = [
  '#1f5cff',
  '#0b39c4',
  '#3f74ff',
  '#ffd200',
  '#ffe24d',
  '#ffffff',
  '#e7eeff',
]

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(a: T[]): T => a[(Math.random() * a.length) | 0]

type Shape = 'rect' | 'streamer' | 'flag' | 'emoji'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  w: number
  h: number
  rot: number
  vr: number
  g: number
  d: number
  life: number
  color: string
  shape: Shape
  char: string // the emoji glyph when shape === 'emoji'
}

interface EngineOptions {
  colors: string[]
  // When provided, the "special" particle draws a random emoji from this list;
  // otherwise it falls back to the BiH mini-flag (drawMiniFlag).
  emojis?: string[]
}

// A tiny BiH flag particle: blue field + yellow corner triangle. Drawn a few at
// a time amongst the confetti for a bit of identity.
const drawMiniFlag = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = '#0b39c4'
  ctx.fillRect(-w / 2, -h / 2, w, h)
  ctx.fillStyle = '#ffd200'
  ctx.beginPath()
  ctx.moveTo(-w / 2, -h / 2)
  ctx.lineTo(w / 2, -h / 2)
  ctx.lineTo(w / 2, h / 2)
  ctx.closePath()
  ctx.fill()
}

// The confetti engine. Kept outside React so a volley is a plain imperative
// call; the rAF loop runs only while particles are alive and sleeps when the
// last one leaves the screen, so it costs nothing while idle.
const createEngine = (
  canvas: HTMLCanvasElement,
  { colors, emojis }: EngineOptions
) => {
  const ctx = canvas.getContext('2d')
  // jsdom has no 2d context — bail out gracefully so tests don't crash.
  if (!ctx) {
    return { launch: () => {}, destroy: () => {} }
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  let W = 0
  let H = 0
  const parts: Particle[] = []
  let raf: number | null = null
  let emitFrames = 0

  const resize = () => {
    W = window.innerWidth
    H = window.innerHeight
    canvas.width = Math.max(1, Math.floor(W * dpr))
    canvas.height = Math.max(1, Math.floor(H * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()

  // One frame's worth of confetti from both bottom corners, aimed up and inward
  // like stadium cannons. Some particles are long thin streamers.
  const emit = () => {
    for (let s = 0; s < 2; s++) {
      const left = s === 0
      const ox = left ? 8 : W - 8
      const baseAng = left
        ? rand(-1.15, -0.55)
        : rand(Math.PI + 0.55, Math.PI + 1.15)
      const hasEmojis = !!emojis && emojis.length > 0
      for (let i = 0; i < 6; i++) {
        const sp = rand(11, 19)
        const streamer = Math.random() < 0.35
        const shape: Shape = streamer
          ? 'streamer'
          : Math.random() < 0.12
          ? hasEmojis
            ? 'emoji'
            : 'flag'
          : 'rect'
        parts.push({
          x: ox,
          y: H - 6,
          vx: Math.cos(baseAng) * sp + rand(-1, 1),
          vy: Math.sin(baseAng) * sp + rand(-1, 1),
          w: streamer ? rand(3, 5) : rand(7, 12),
          h: streamer ? rand(16, 34) : rand(5, 9),
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.3, 0.3),
          g: 0.17,
          d: 0.992,
          life: rand(95, 150),
          color: pick(colors),
          shape,
          char: shape === 'emoji' ? pick(emojis!) : '',
        })
      }
    }
  }

  const update = () => {
    if (emitFrames > 0) {
      emit()
      emitFrames--
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]
      p.vy += p.g
      p.vx *= p.d
      p.vy *= p.d
      p.x += p.vx
      p.y += p.vy
      p.rot += p.vr
      p.life--
      if (p.life <= 0 || p.y > H + 40) parts.splice(i, 1)
    }
  }

  const render = () => {
    ctx.clearRect(0, 0, W, H)
    for (const p of parts) {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 28))
      if (p.shape === 'flag') {
        drawMiniFlag(ctx, p.w + 4, p.h + 2)
      } else if (p.shape === 'emoji') {
        const size = Math.max(p.w, p.h) * 2.2
        ctx.font = `${size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.char, 0, 0)
      } else {
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      }
      ctx.restore()
    }
  }

  const loop = () => {
    update()
    render()
    if (parts.length || emitFrames > 0) {
      raf = requestAnimationFrame(loop)
    } else {
      // sleep: nothing on screen, stop the loop entirely
      raf = null
      ctx.clearRect(0, 0, W, H)
    }
  }

  const launch = () => {
    emitFrames = 34 // ~0.6s of sustained firing
    if (raf == null) raf = requestAnimationFrame(loop)
  }

  window.addEventListener('resize', resize)
  const destroy = () => {
    if (raf != null) cancelAnimationFrame(raf)
    raf = null
    window.removeEventListener('resize', resize)
  }

  return { launch, destroy }
}

// Fires a volley of confetti cannons whenever `fire` increments. Defaults to
// the BiH flag palette + mini-flag particle (victory day); pass `colors` and
// `emojis` to re-theme it (e.g. the birthday volley). Hidden entirely for users
// who prefer reduced motion.
export const ConfettiCannons = ({
  fire,
  colors = COLORS,
  emojis,
}: {
  fire: number
  colors?: string[]
  emojis?: string[]
}) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<ReturnType<typeof createEngine> | null>(null)

  useEffect(() => {
    if (prefersReducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return
    const engine = createEngine(canvas, { colors, emojis })
    engineRef.current = engine
    return () => {
      engine.destroy()
      engineRef.current = null
    }
  }, [prefersReducedMotion, colors, emojis])

  useEffect(() => {
    if (prefersReducedMotion) return
    if (fire > 0) engineRef.current?.launch()
  }, [fire, prefersReducedMotion])

  if (prefersReducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      data-testid="confetti-cannons"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        // Above the board and the ball (z-index 5) but under modals (z-10),
        // matching the snow/ball layering.
        zIndex: 6,
        pointerEvents: 'none',
      }}
    />
  )
}
