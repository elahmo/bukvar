import { isWorldCupActive, WORLD_CUP_START, WORLD_CUP_END } from './worldCup'

describe('isWorldCupActive', () => {
  test('is false the day before the tournament starts', () => {
    expect(isWorldCupActive(new Date(2026, 5, 10, 12, 0))).toBe(false)
  })

  test('is true on the opening day', () => {
    expect(isWorldCupActive(new Date(2026, 5, 11, 0, 0))).toBe(true)
  })

  test('is true in the middle of the tournament', () => {
    expect(isWorldCupActive(new Date(2026, 5, 22, 9, 30))).toBe(true)
  })

  test('is true on the final day', () => {
    expect(isWorldCupActive(new Date(2026, 6, 19, 20, 0))).toBe(true)
  })

  test('is false the day after the final', () => {
    expect(isWorldCupActive(new Date(2026, 6, 20, 0, 1))).toBe(false)
  })

  test('is false well outside the window (other years)', () => {
    expect(isWorldCupActive(new Date(2025, 11, 25))).toBe(false)
    expect(isWorldCupActive(new Date(2027, 5, 15))).toBe(false)
  })

  test('includes the exact start and end boundaries', () => {
    expect(isWorldCupActive(WORLD_CUP_START)).toBe(true)
    expect(isWorldCupActive(WORLD_CUP_END)).toBe(true)
  })
})
