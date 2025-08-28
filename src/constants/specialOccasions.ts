export interface SpecialOccasion {
  name: string
  date: { month: number; day: number } // month is 0-indexed (January = 0)
  word: string
  year?: number // optional, if specified only applies to that year
}

export const SPECIAL_OCCASIONS: SpecialOccasion[] = [
  {
    name: "SAJAM",
    date: { month: 7, day: 29 }, // August 29th
    year: 2025,
    word: 'SAJAM'
  },
  {
    name: "Mali lopovcic",
    date: { month: 8, day: 24 }, // September 24th
    year: 2025,
    word: 'lopov'
  },
  {
    name: "Dan državnosti",
    date: { month: 10, day: 25 }, // November 25th
    year: 2026,
    word: 'ponos'
  },
]

export const getSpecialOccasionForDate = (date: Date): SpecialOccasion | null => {
  const month = date.getMonth()
  const day = date.getDate()
  const year = date.getFullYear()

  return SPECIAL_OCCASIONS.find(occasion => {
    const matchesDate = occasion.date.month === month && occasion.date.day === day
    const matchesYear = !occasion.year || occasion.year === year
    return matchesDate && matchesYear
  }) || null
}

// Get all special occasion words (for adding to rotation)
export const getSpecialOccasionWords = (): string[] => {
  return SPECIAL_OCCASIONS.map(occasion => occasion.word)
}