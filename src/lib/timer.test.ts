import {
  __resetForTests,
  bucketSolveTime,
  finishTimer,
  formatTime,
  getElapsed,
  getFinalTime,
  initTimer,
  isTimerFinished,
  isTimerStarted,
  pauseTimer,
  resumeTimer,
  startTimer,
} from './timer'

const TODAY = 'TESTA'
const OTHER = 'NEKAD'

beforeEach(() => {
  __resetForTests()
  localStorage.clear()
})

afterEach(() => {
  __resetForTests()
  localStorage.clear()
})

describe('formatTime', () => {
  test('formats seconds under a minute as 0:SS', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(1000)).toBe('0:01')
    expect(formatTime(42_000)).toBe('0:42')
  })

  test('formats minutes as M:SS with zero-padded seconds', () => {
    expect(formatTime(60_000)).toBe('1:00')
    expect(formatTime(83_000)).toBe('1:23')
    expect(formatTime(599_000)).toBe('9:59')
  })

  test('formats over an hour as H:MM:SS', () => {
    expect(formatTime(3_600_000)).toBe('1:00:00')
    expect(formatTime(3_723_000)).toBe('1:02:03')
  })

  test('treats negative values as zero', () => {
    expect(formatTime(-1000)).toBe('0:00')
  })
})

describe('bucketSolveTime', () => {
  test.each([
    [0, '<30s'],
    [29_999, '<30s'],
    [30_000, '30-60s'],
    [59_999, '30-60s'],
    [60_000, '1-2m'],
    [119_999, '1-2m'],
    [120_000, '2-5m'],
    [299_999, '2-5m'],
    [300_000, '5-10m'],
    [599_999, '5-10m'],
    [600_000, '>10m'],
    [60 * 60 * 1000, '>10m'],
  ])('%i ms → %s', (ms, expected) => {
    expect(bucketSolveTime(ms)).toBe(expected)
  })

  test('treats negative as <30s', () => {
    expect(bucketSolveTime(-5000)).toBe('<30s')
  })
})

describe('timer lifecycle', () => {
  test('is not started until startTimer is called', () => {
    expect(isTimerStarted()).toBe(false)
    startTimer(TODAY)
    expect(isTimerStarted()).toBe(true)
  })

  test('startTimer is a no-op if already started', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 0, 1, 12, 0, 0))
    startTimer(TODAY)
    jest.advanceTimersByTime(5_000)
    startTimer(TODAY) // should not reset
    expect(getElapsed()).toBeGreaterThanOrEqual(5_000)
    jest.useRealTimers()
  })

  test('pause then resume accumulates correctly', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 0, 1, 12, 0, 0))
    startTimer(TODAY)
    jest.advanceTimersByTime(3_000)
    pauseTimer()
    expect(getElapsed()).toBe(3_000)
    jest.advanceTimersByTime(10_000) // time elapses while paused — should not count
    expect(getElapsed()).toBe(3_000)
    resumeTimer()
    jest.advanceTimersByTime(2_000)
    expect(getElapsed()).toBe(5_000)
    jest.useRealTimers()
  })

  test('finishTimer returns total elapsed and marks finished', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 0, 1, 12, 0, 0))
    startTimer(TODAY)
    jest.advanceTimersByTime(4_500)
    const final = finishTimer()
    expect(final).toBe(4_500)
    expect(isTimerFinished()).toBe(true)
    expect(getFinalTime()).toBe(4_500)
    jest.useRealTimers()
  })

  test('pause/resume are no-ops after finish', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 0, 1, 12, 0, 0))
    startTimer(TODAY)
    jest.advanceTimersByTime(2_000)
    finishTimer()
    pauseTimer()
    resumeTimer()
    jest.advanceTimersByTime(5_000)
    expect(getFinalTime()).toBe(2_000)
    jest.useRealTimers()
  })

  test('finishTimer is idempotent', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 0, 1, 12, 0, 0))
    startTimer(TODAY)
    jest.advanceTimersByTime(1_000)
    const first = finishTimer()
    jest.advanceTimersByTime(1_000)
    const second = finishTimer()
    expect(second).toBe(first)
    jest.useRealTimers()
  })
})

describe('initTimer (persistence and day boundaries)', () => {
  test('clears state when the solution has changed (new day)', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 0, 1, 12, 0, 0))
    startTimer(TODAY)
    jest.advanceTimersByTime(2_000)
    pauseTimer()
    expect(localStorage.getItem('gameTimer')).not.toBeNull()
    __resetForTests()
    initTimer(OTHER)
    expect(isTimerStarted()).toBe(false)
    expect(localStorage.getItem('gameTimer')).toBeNull()
    jest.useRealTimers()
  })

  test('restores paused state across reload for the same solution', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 0, 1, 12, 0, 0))
    startTimer(TODAY)
    jest.advanceTimersByTime(3_000)
    pauseTimer()
    __resetForTests() // simulate page reload
    initTimer(TODAY)
    expect(isTimerStarted()).toBe(true)
    expect(getElapsed()).toBe(3_000)
    jest.useRealTimers()
  })

  test('restores finished state across reload', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 0, 1, 12, 0, 0))
    startTimer(TODAY)
    jest.advanceTimersByTime(7_000)
    finishTimer()
    __resetForTests()
    initTimer(TODAY)
    expect(isTimerFinished()).toBe(true)
    expect(getFinalTime()).toBe(7_000)
    jest.useRealTimers()
  })

  test('handles corrupt localStorage gracefully', () => {
    localStorage.setItem('gameTimer', '{not json')
    initTimer(TODAY)
    expect(isTimerStarted()).toBe(false)
    expect(localStorage.getItem('gameTimer')).toBeNull()
  })
})
