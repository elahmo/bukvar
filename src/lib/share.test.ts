import { buildShareText } from './share'

// The grid emojis depend on the daily solution, so we just sanity-check
// the framing (header, blank line, footer presence/absence) rather than
// the per-cell colors.

describe('buildShareText', () => {
  test('includes the time line when solveTimeMs is provided', () => {
    const text = buildShareText(['PAŽNJA'.slice(0, 5)], false, 76_000)
    expect(text).toMatch(/^Bukvar \d+ 1\/6\n\n/)
    expect(text).toMatch(/\n\n⏱ 1:16$/)
  })

  test('omits the time line when solveTimeMs is null', () => {
    const text = buildShareText(['PAŽNJA'.slice(0, 5)], false, null)
    expect(text).toMatch(/^Bukvar \d+ 1\/6\n\n/)
    expect(text).not.toMatch(/⏱/)
  })

  test('uses X/6 on a loss', () => {
    const text = buildShareText(
      ['AAAAA', 'BBBBB', 'CCCCC', 'DDDDD', 'EEEEE', 'FFFFF'],
      true,
      123_000
    )
    expect(text).toMatch(/^Bukvar \d+ X\/6\n\n/)
    expect(text).toMatch(/⏱ 2:03$/)
  })

  test('omits the time line for zero / negative ms', () => {
    expect(buildShareText(['AAAAA'], false, 0)).not.toMatch(/⏱/)
    expect(buildShareText(['AAAAA'], false, -100)).not.toMatch(/⏱/)
  })

  test('ends with the grid (no trailing newline) when no time', () => {
    const text = buildShareText(['AAAAA'], false, null)
    expect(text.endsWith('\n')).toBe(false)
  })

  test('ends with the time line (no trailing newline) when present', () => {
    const text = buildShareText(['AAAAA'], false, 5_000)
    expect(text.endsWith('⏱ 0:05')).toBe(true)
  })
})
