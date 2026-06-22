// 2026 FIFA World Cup (hosted by Canada, Mexico & the USA): June 11 – July 19,
// 2026. During this window Bukvar gets a touch of football: a faint pitch drawn
// behind the board and a small, draggable/kickable ball (see
// src/components/effects/FootballOverlay.tsx). Outside the window everything is
// inert — the feature is gated entirely on this date check, mirroring the
// existing winter theme in App.tsx.
export const WORLD_CUP_START = new Date(2026, 5, 11) // June 11, 2026 (months are 0-indexed)
export const WORLD_CUP_END = new Date(2026, 6, 19, 23, 59, 59, 999) // July 19, 2026, end of day

export const isWorldCupActive = (date: Date = new Date()): boolean => {
  const time = date.getTime()
  return time >= WORLD_CUP_START.getTime() && time <= WORLD_CUP_END.getTime()
}
