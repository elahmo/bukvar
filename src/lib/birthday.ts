// A small, recurring birthday easter egg (July 1, every year). On this day
// Bukvar drops in a draggable/kickable birthday cake alongside the World Cup
// ball (when that window is active) and fires a soft, party-coloured confetti
// volley on open and again when the player solves the word. Purely visual — it
// does NOT touch the daily puzzle word. Everything is gated on this date check,
// mirroring the winter theme (App.tsx) and the World Cup window (worldCup.ts),
// and respects prefers-reduced-motion at the component level.
export const isBirthdayActive = (date: Date = new Date()): boolean => {
  return date.getMonth() === 6 && date.getDate() === 1 // July 1 (months 0-indexed)
}

// Warm party palette for the birthday confetti — pink / gold / lilac / mint /
// coral / white, deliberately unlike the BiH-flag palette used on victory day.
export const BIRTHDAY_COLORS = [
  '#ff5fa2',
  '#ff8fc0',
  '#ffd94a',
  '#a06bff',
  '#4fd1a5',
  '#ff8a5c',
  '#ffffff',
]

// A few emoji sprinkled amongst the confetti for a bit of birthday identity
// (drawn a handful at a time — see ConfettiCannons).
export const BIRTHDAY_EMOJIS = ['🎉', '🎈', '🎂', '✨']
