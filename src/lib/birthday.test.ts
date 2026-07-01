import { isBirthdayActive, BIRTHDAY_COLORS, BIRTHDAY_EMOJIS } from './birthday'

describe('isBirthdayActive', () => {
  test('is true on July 1st', () => {
    expect(isBirthdayActive(new Date(2026, 6, 1, 0, 0))).toBe(true)
    expect(isBirthdayActive(new Date(2026, 6, 1, 23, 59))).toBe(true)
  })

  test('recurs every year on July 1st', () => {
    expect(isBirthdayActive(new Date(2027, 6, 1))).toBe(true)
    expect(isBirthdayActive(new Date(2030, 6, 1))).toBe(true)
  })

  test('is false the day before and the day after', () => {
    expect(isBirthdayActive(new Date(2026, 5, 30, 12, 0))).toBe(false)
    expect(isBirthdayActive(new Date(2026, 6, 2, 12, 0))).toBe(false)
  })

  test('is false on unrelated dates', () => {
    expect(isBirthdayActive(new Date(2026, 0, 1))).toBe(false) // Jan 1
    expect(isBirthdayActive(new Date(2026, 6, 11))).toBe(false) // Jul 11
  })
})

describe('birthday theme constants', () => {
  test('exposes a non-empty party palette and emoji set', () => {
    expect(BIRTHDAY_COLORS.length).toBeGreaterThan(0)
    expect(BIRTHDAY_EMOJIS.length).toBeGreaterThan(0)
  })
})
