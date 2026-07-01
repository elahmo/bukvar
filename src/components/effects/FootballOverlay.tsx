import { useEffect } from 'react'
import { KickableEmoji } from './KickableEmoji'

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

// The kickable football: the World Cup toy. The physics live in the shared
// KickableEmoji component (see there); this just picks the ball emoji and its
// starting corner. Hidden entirely for users who prefer reduced motion.
export const FootballOverlay = () => {
  return <KickableEmoji emoji="⚽" testId="football" />
}
