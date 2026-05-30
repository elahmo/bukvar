const STORAGE_KEY = 'gameTimer'
const TICK_INTERVAL_MS = 1000

type StoredTimer = {
  solution: string
  accumulatedMs: number
  finished: boolean
}

type ActiveTimer = {
  stored: StoredTimer
  resumedAt: number | null
}

let state: ActiveTimer | null = null
let tickHandle: ReturnType<typeof setInterval> | null = null

const computeElapsed = (s: ActiveTimer): number => {
  const runningExtra = s.resumedAt !== null ? Date.now() - s.resumedAt : 0
  return s.stored.accumulatedMs + runningExtra
}

const persist = () => {
  if (!state) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }
  const toSave: StoredTimer = {
    ...state.stored,
    accumulatedMs: computeElapsed(state),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
}

const startTicking = () => {
  if (tickHandle !== null) return
  tickHandle = setInterval(persist, TICK_INTERVAL_MS)
}

const stopTicking = () => {
  if (tickHandle === null) return
  clearInterval(tickHandle)
  tickHandle = null
}

export const initTimer = (solution: string): void => {
  stopTicking()
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as StoredTimer
      if (parsed.solution === solution) {
        state = { stored: parsed, resumedAt: null }
        return
      }
    } catch {
      // fall through to reset
    }
  }
  state = null
  localStorage.removeItem(STORAGE_KEY)
}

export const startTimer = (solution: string): void => {
  if (state !== null) return
  state = {
    stored: { solution, accumulatedMs: 0, finished: false },
    resumedAt: Date.now(),
  }
  persist()
  startTicking()
}

export const resumeTimer = (): void => {
  if (!state) return
  if (state.stored.finished) return
  if (state.resumedAt !== null) return
  state.resumedAt = Date.now()
  startTicking()
}

export const pauseTimer = (): void => {
  if (!state) return
  if (state.stored.finished) return
  if (state.resumedAt === null) return
  state.stored.accumulatedMs = computeElapsed(state)
  state.resumedAt = null
  stopTicking()
  persist()
}

export const finishTimer = (): number | null => {
  if (!state) return null
  if (state.stored.finished) return state.stored.accumulatedMs
  state.stored.accumulatedMs = computeElapsed(state)
  state.resumedAt = null
  state.stored.finished = true
  stopTicking()
  persist()
  return state.stored.accumulatedMs
}

export const isTimerStarted = (): boolean => state !== null

export const isTimerFinished = (): boolean =>
  state !== null && state.stored.finished

export const getFinalTime = (): number | null => {
  if (!state || !state.stored.finished) return null
  return state.stored.accumulatedMs
}

export const getElapsed = (): number => (state === null ? 0 : computeElapsed(state))

export const formatTime = (ms: number): string => {
  const totalSec = Math.floor(Math.max(0, ms) / 1000)
  const sec = totalSec % 60
  const min = Math.floor(totalSec / 60)
  if (min >= 60) {
    const hr = Math.floor(min / 60)
    return `${hr}:${String(min % 60).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }
  return `${min}:${String(sec).padStart(2, '0')}`
}

export const bucketSolveTime = (ms: number): string => {
  const sec = Math.floor(Math.max(0, ms) / 1000)
  if (sec < 30) return '<30s'
  if (sec < 60) return '30-60s'
  if (sec < 120) return '1-2m'
  if (sec < 300) return '2-5m'
  if (sec < 600) return '5-10m'
  return '>10m'
}

export const clearTimer = (): void => {
  stopTicking()
  state = null
  localStorage.removeItem(STORAGE_KEY)
}

export const __resetForTests = (): void => {
  stopTicking()
  state = null
}
