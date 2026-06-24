import {
  getCelebrationForDate,
  getSpecialOccasionForDate,
} from './specialOccasions'

describe('Bosna victory override (25 June 2026)', () => {
  const victoryDay = new Date(2026, 5, 25) // June 25, 2026

  test('overrides the word to BOSNA', () => {
    expect(getSpecialOccasionForDate(victoryDay)?.word).toBe('BOSNA')
  })

  test('flags the day for the bosnia-victory celebration', () => {
    expect(getCelebrationForDate(victoryDay)).toBe('bosnia-victory')
  })

  test('does not fire the celebration on other days', () => {
    expect(getCelebrationForDate(new Date(2026, 5, 24))).toBeUndefined()
    expect(getCelebrationForDate(new Date(2025, 5, 25))).toBeUndefined() // wrong year
  })
})
