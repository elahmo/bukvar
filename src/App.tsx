import {
  ChartBarIcon,
  CogIcon,
  InformationCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline'
import Plausible from 'plausible-tracker'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Alert } from './components/alerts/Alert'
import { SnowfallOverlay } from './components/effects/SnowfallOverlay'
import {
  FootballOverlay,
  FootballPitchBackground,
} from './components/effects/FootballOverlay'
import { ConfettiCannons } from './components/effects/ConfettiCannons'
import { KickableEmoji } from './components/effects/KickableEmoji'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { AboutModal } from './components/modals/AboutModal'
import { InfoModal } from './components/modals/InfoModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { StatsModal } from './components/modals/StatsModal'
import { SuggestWordModal } from './components/modals/SuggestWordModal'
import { PravopisLinkModal } from './components/modals/PravopisLinkModal'
import { TimeTrackingConsentModal } from './components/modals/TimeTrackingConsentModal'
import { WomensDayModal } from './components/modals/WomensDayModal'
import { WordlistUpdateModal } from './components/modals/WordlistUpdateModal'
import {
  ABOUT_GAME_MESSAGE,
  CORRECT_WORD_MESSAGE,
  GAME_COPIED_MESSAGE,
  GAME_TITLE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  SETTINGS_TITLE,
  SOLVE_TIME_TEXT,
  WIN_MESSAGES,
  WORD_NOT_FOUND_MESSAGE,
  COMMUNITY_FASTER_SHORT,
} from './constants/strings'
import {
  loadGameStateFromLocalStorage,
  loadTimeTrackingPreferenceFromLocalStorage,
  saveGameStateToLocalStorage,
  saveTimeTrackingPreferenceToLocalStorage,
  TimeTrackingPreference,
} from './lib/localStorage'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import {
  CommunityStats,
  fetchCommunityStats,
  fasterThanPercent,
} from './lib/community'
import {
  bucketSolveTime,
  clearTimer,
  finishTimer,
  formatTime,
  getFinalTime,
  initTimer,
  isTimerStarted,
  pauseTimer,
  resumeTimer,
  startTimer,
} from './lib/timer'
import { isWinningWord, isWordInWordList, solution } from './lib/words'
import { WORD_DEFINITIONS } from './constants/wordDefinitions'
import { WordMeaning } from './components/WordMeaning'
import { isWorldCupActive } from './lib/worldCup'
import {
  isBirthdayActive,
  BIRTHDAY_COLORS,
  BIRTHDAY_EMOJIS,
} from './lib/birthday'
import { getCelebrationForDate } from './constants/specialOccasions'

const ALERT_TIME_MS = 3000

// Today's definition, if we have one. Drives the post-game "Značenje" card that
// replaces the keyboard, and a small extra delay before the stats modal so the
// card is readable first. Undefined for words not yet defined (card is skipped).
const todayMeaning = WORD_DEFINITIONS[solution.toLowerCase()]

// Module-level so the tracker isn't re-instantiated on every render.
const plausible = Plausible({
  domain: 'elahmo.github.io',
  apiHost: 'https://plausible.novalic.xyz',
})

const isWinterThemeActive = (date: Date) => {
  const month = date.getMonth() // 0-indexed
  const day = date.getDate()

  // Active every year from Dec 15 through Jan 15 (inclusive)
  const isDecember = month === 11 && day >= 15
  const isJanuary = month === 0 && day <= 15
  return isDecember || isJanuary
}

function App() {
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isPravopisLinkModalOpen, setIsPravopisLinkModalOpen] = useState(false)
  const [isWomensDayModalOpen, setIsWomensDayModalOpen] = useState(false)
  const [isWordlistUpdateModalOpen, setIsWordlistUpdateModalOpen] =
    useState(false)
  // True when the one-time "word list updated" notice is due but is waiting for
  // the intro InfoModal to be dismissed first (so first-time players don't get
  // two stacked modals).
  const [announcementPending, setAnnouncementPending] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [isNotEnoughLetters, setIsNotEnoughLetters] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isSuggestWordModalOpen, setIsSuggestWordModalOpen] = useState(false)
  const [isWordNotFoundAlertOpen, setIsWordNotFoundAlertOpen] = useState(false)
  const [isGameLost, setIsGameLost] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDarkMode
      ? true
      : false
  )
  const [successAlert, setSuccessAlert] = useState('')
  // Incrementing this fires a volley from <ConfettiCannons> (Bosna victory day).
  const [confettiFire, setConfettiFire] = useState(0)
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage()
    if (loaded == null) {
      setIsInfoModalOpen(true)
    }
    if (loaded?.solution !== solution) {
      return []
    }
    const gameWasWon = loaded.guesses.includes(solution)
    if (gameWasWon) {
      setIsGameWon(true)
    }
    if (loaded.guesses.length === 6 && !gameWasWon) {
      setIsGameLost(true)
    }
    return loaded.guesses
  })

  const [stats, setStats] = useState(() => loadStats())
  // Community ("Današnji igrači bukvara") stats from the forms backend. Null
  // until loaded, and stays null if the backend is unreachable — every consumer
  // guards on it, so the game works fully without it.
  const [community, setCommunity] = useState<CommunityStats | null>(null)
  const [timeTrackingPreference, setTimeTrackingPreference] =
    useState<TimeTrackingPreference | null>(() =>
      loadTimeTrackingPreferenceFromLocalStorage()
    )
  const isTimeTrackingEnabled = timeTrackingPreference === 'on'
  const [todaySolveTimeMs, setTodaySolveTimeMs] = useState<number | null>(
    () => {
      if (timeTrackingPreference !== 'on') return null
      initTimer(solution)
      return getFinalTime()
    }
  )
  const isConsentPending = timeTrackingPreference === null
  // Stack with the InfoModal: the consent modal only becomes visible once the
  // intro popup is dismissed (or wasn't shown to begin with). Input is gated
  // on isConsentPending regardless, so users can't sneak guesses through
  // while one modal hides behind the other.
  const isConsentModalVisible = isConsentPending && !isInfoModalOpen
  const [isTabHidden, setIsTabHidden] = useState(
    typeof document !== 'undefined' ? document.hidden : false
  )

  const shouldShowPravopisLink = () => {
    // Temporarily disable Pravopis banner
    return false

    // Original implementation
    /*
    const lastShown = localStorage.getItem('pravopisLinkLastShown')
    if (!lastShown) return true
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return new Date(lastShown) < oneWeekAgo
    */
  }

  const isInternationalWomensDay = () => {
    const today = new Date()
    return today.getMonth() === 2 && today.getDate() === 8 // March is month 2 (0-indexed)
  }

  // One-time notice that the word list was relaunched (new randomized list from
  // 2026-06-29). Shown once per user, and only during a ~2-week window so that
  // players who join long after the change don't get a stale "updated" popup.
  const shouldShowWordlistUpdate = () => {
    if (localStorage.getItem('wordlistUpdateSeen')) return false
    const now = new Date()
    const start = new Date(2026, 5, 29) // 2026-06-29 (month is 0-indexed)
    const end = new Date(2026, 6, 13, 23, 59, 59) // through 2026-07-13
    return now >= start && now <= end
  }

  useEffect(() => {
    if (shouldShowPravopisLink()) {
      setIsPravopisLinkModalOpen(true)
      localStorage.setItem('pravopisLinkLastShown', new Date().toISOString())
    }

    // Check if it's International Women's Day
    if (isInternationalWomensDay()) {
      setIsWomensDayModalOpen(true)
    }

    // Queue the one-time word-list-update notice (actual display is deferred to
    // the watcher effect below so it never stacks on the intro InfoModal).
    if (shouldShowWordlistUpdate()) {
      setAnnouncementPending(true)
    }

    // Simple daily refresh check - only set up interval for long-running sessions
    const today = new Date().toDateString()
    localStorage.setItem('lastVisitDate', today)

    // Set up interval to check for date change for long-running sessions
    const midnightCheck = setInterval(() => {
      const currentDate = new Date().toDateString()
      const storedDate = localStorage.getItem('lastVisitDate')

      if (storedDate && storedDate !== currentDate) {
        localStorage.setItem('lastVisitDate', currentDate)
        window.location.reload()
      }
    }, 60000) // Check every minute

    return () => clearInterval(midnightCheck)
  }, [])

  // Show the deferred word-list-update notice once the intro InfoModal is gone
  // (returning players: immediately; first-time players: after they close the
  // intro). Marked seen on display so it only ever shows once.
  useEffect(() => {
    if (announcementPending && !isInfoModalOpen) {
      setIsWordlistUpdateModalOpen(true)
      setAnnouncementPending(false)
      localStorage.setItem('wordlistUpdateSeen', '1')
    }
  }, [announcementPending, isInfoModalOpen])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    const handler = () => setIsTabHidden(document.hidden)
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [])

  // Load community stats once on mount (best-effort; stays null on failure).
  useEffect(() => {
    let active = true
    fetchCommunityStats().then((c) => {
      if (active) setCommunity(c)
    })
    return () => {
      active = false
    }
  }, [])

  const anyModalOpen =
    isInfoModalOpen ||
    isPravopisLinkModalOpen ||
    isWomensDayModalOpen ||
    isWordlistUpdateModalOpen ||
    isAboutModalOpen ||
    isStatsModalOpen ||
    isSuggestWordModalOpen ||
    isSettingsModalOpen ||
    isConsentModalVisible
  const shouldPauseTimer = anyModalOpen || isTabHidden

  useEffect(() => {
    if (!isTimeTrackingEnabled) return
    if (shouldPauseTimer) {
      pauseTimer()
    } else {
      resumeTimer()
    }
  }, [shouldPauseTimer, isTimeTrackingEnabled])

  const winterThemeActive = isWinterThemeActive(new Date())
  const worldCupActive = isWorldCupActive(new Date())
  const isVictoryDay = getCelebrationForDate(new Date()) === 'bosnia-victory'
  const birthdayActive = isBirthdayActive(new Date())
  // Both celebrations fire the confetti cannons (with different palettes); they
  // never share a calendar day, so a single volley counter drives whichever is
  // active today.
  const celebrationActive = isVictoryDay || birthdayActive

  // Everyone gets one volley on the first open of a celebration day. Guarded per
  // day per browser so a refresh doesn't re-blast; the on-win volley below
  // fires independently for players who actually solve it.
  useEffect(() => {
    if (!celebrationActive) return
    const key = `celebrationShown:${new Date().toDateString()}`
    if (localStorage.getItem(key)) return
    localStorage.setItem(key, '1')
    const t = setTimeout(() => setConfettiFire((c) => c + 1), 700)
    return () => clearTimeout(t)
  }, [celebrationActive])

  useEffect(() => {
    if (winterThemeActive) {
      document.documentElement.classList.add('winter')
    } else {
      document.documentElement.classList.remove('winter')
    }
  }, [winterThemeActive])

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const handleEnableTimeTracking = () => {
    saveTimeTrackingPreferenceToLocalStorage('on')
    setTimeTrackingPreference('on')
    initTimer(solution)
    setTodaySolveTimeMs(getFinalTime())
  }

  const handleDisableTimeTracking = () => {
    saveTimeTrackingPreferenceToLocalStorage('off')
    setTimeTrackingPreference('off')
    clearTimer()
    setTodaySolveTimeMs(null)
  }

  const handleTimeTracking = (enabled: boolean) => {
    if (enabled) {
      handleEnableTimeTracking()
    } else {
      handleDisableTimeTracking()
    }
  }

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, solution })
  }, [guesses])

  // Fire the end-of-game celebration exactly once. The effect also depends on
  // todaySolveTimeMs (for the time suffix), which can now change after the
  // game ends — toggling time tracking in Settings — and must not replay the
  // alert or reopen the stats modal.
  const gameEndAlertFiredRef = useRef(false)

  useEffect(() => {
    if (gameEndAlertFiredRef.current) {
      return
    }
    if (isGameWon) {
      gameEndAlertFiredRef.current = true
      if (celebrationActive) {
        setConfettiFire((c) => c + 1)
      }
      const baseMsg =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
      const finalMs = todaySolveTimeMs ?? getFinalTime()
      let winMsg =
        finalMs !== null
          ? `${baseMsg} ${SOLVE_TIME_TEXT} ${formatTime(finalMs)}.`
          : baseMsg
      // Best-effort community percentile, only if stats already loaded.
      const pct =
        community && finalMs !== null
          ? fasterThanPercent(community, Math.round(finalMs / 1000))
          : null
      if (pct !== null) {
        winMsg += `\n${COMMUNITY_FASTER_SHORT(pct)}`
      }
      setSuccessAlert(winMsg)
      // Clear the win banner on schedule, but give the "Značenje" card an extra
      // ~1.5s in view before the stats modal covers it (only if defined today).
      setTimeout(() => setSuccessAlert(''), ALERT_TIME_MS)
      setTimeout(
        () => setIsStatsModalOpen(true),
        ALERT_TIME_MS + (todayMeaning ? 1500 : 0)
      )
    }
    if (isGameLost) {
      gameEndAlertFiredRef.current = true
      setTimeout(
        () => setIsStatsModalOpen(true),
        ALERT_TIME_MS + (todayMeaning ? 1500 : 0)
      )
    }
  }, [isGameWon, isGameLost, todaySolveTimeMs, celebrationActive, community])

  const onChar = (value: string) => {
    if (isConsentPending) return
    if (currentGuess.length < 5 && guesses.length < 6 && !isGameWon) {
      if (isTimeTrackingEnabled && !isTimerStarted()) {
        startTimer(solution)
      }
      setCurrentGuess(`${currentGuess}${value}`)
      plausible.trackEvent('char', { props: { char: value } })
    }
  }

  const onDelete = () => {
    if (isConsentPending) return
    setCurrentGuess(currentGuess.slice(0, -1))
  }

  const onEnter = () => {
    if (isConsentPending) return
    if (isGameWon || isGameLost) {
      return
    }
    if (!(currentGuess.length === 5)) {
      setIsNotEnoughLetters(true)
      return setTimeout(() => {
        setIsNotEnoughLetters(false)
      }, ALERT_TIME_MS)
    }

    if (!isWordInWordList(currentGuess)) {
      setIsWordNotFoundAlertOpen(true)
      plausible.trackEvent('wordNotFound', { props: { word: currentGuess } })
      return setTimeout(() => {
        setIsWordNotFoundAlertOpen(false)
      }, ALERT_TIME_MS)
    }

    const winningWord = isWinningWord(currentGuess)

    if (currentGuess.length === 5 && guesses.length < 6 && !isGameWon) {
      setGuesses([...guesses, currentGuess])
      plausible.trackEvent('guess', { props: { word: currentGuess } })
      setCurrentGuess('')

      if (winningWord) {
        const finalMs = isTimeTrackingEnabled ? finishTimer() : null
        setTodaySolveTimeMs(finalMs)
        setStats(addStatsForCompletedGame(stats, guesses.length, finalMs))
        plausible.trackEvent('gameWon', {
          props: {
            guesses: `${guesses.length}`,
            word: currentGuess,
            ...(finalMs !== null && {
              solveTimeSec: Math.round(finalMs / 1000),
              solveTimeBucket: bucketSolveTime(finalMs),
            }),
          },
        })
        return setIsGameWon(true)
      }

      if (guesses.length === 5) {
        const finalMs = isTimeTrackingEnabled ? finishTimer() : null
        setStats(addStatsForCompletedGame(stats, guesses.length + 1))
        plausible.trackEvent('gameLost', {
          props: {
            word: currentGuess,
            ...(finalMs !== null && {
              solveTimeSec: Math.round(finalMs / 1000),
              solveTimeBucket: bucketSolveTime(finalMs),
            }),
          },
        })
        setIsGameLost(true)
      }
    }
  }

  return (
    <div className="py-2 max-w-7xl mx-auto sm:px-6 lg:px-8">
      {winterThemeActive && <SnowfallOverlay isDarkMode={isDarkMode} />}
      {worldCupActive && <FootballPitchBackground isDarkMode={isDarkMode} />}
      {worldCupActive && <FootballOverlay />}
      {isVictoryDay && <ConfettiCannons fire={confettiFire} />}
      {birthdayActive && (
        <ConfettiCannons
          fire={confettiFire}
          colors={BIRTHDAY_COLORS}
          emojis={BIRTHDAY_EMOJIS}
        />
      )}
      {birthdayActive && (
        <KickableEmoji
          emoji="🎂"
          testId="birthday-cake"
          startCorner="top-left"
          introVx={30}
          introVy={40}
        />
      )}
      <div className="flex w-80 mx-auto items-center mb-2 mt-2">
        <h1 className="text-xl ml-2.5 grow font-bold dark:text-white relative">
          {winterThemeActive && (
            <svg
              className="absolute pointer-events-none"
              style={{
                top: '-8px',
                left: '-3px',
                width: '21px',
                height: '21px',
              }}
              viewBox="0 0 24 24"
              fill="none"
            >
              {/* Santa hat */}
              <path
                d="M4,18 Q2,18 2,16 L6,8 Q12,4 18,10 L16,16 Q16,18 14,18 Z"
                fill="#e53935"
              />
              <ellipse cx="18" cy="8" rx="3" ry="3" fill="white" />
              <path
                d="M2,16 Q2,19 5,19 L13,19 Q16,19 16,16"
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          )}
          {GAME_TITLE}
        </h1>
        <PlusCircleIcon
          className="h-5 w-5 mr-2 cursor-pointer dark:stroke-white"
          onClick={() => setIsSuggestWordModalOpen(true)}
        />
        <InformationCircleIcon
          className="h-5 w-5 mr-2 cursor-pointer dark:stroke-white"
          onClick={() => setIsInfoModalOpen(true)}
        />
        <ChartBarIcon
          className="h-5 w-5 mr-2 cursor-pointer dark:stroke-white"
          onClick={() => setIsStatsModalOpen(true)}
        />
        <CogIcon
          className="h-5 w-5 mr-2 cursor-pointer dark:stroke-white"
          aria-label={SETTINGS_TITLE}
          onClick={() => setIsSettingsModalOpen(true)}
        />
      </div>
      <Grid guesses={guesses} currentGuess={currentGuess} />
      {(isGameWon || isGameLost) && todayMeaning ? (
        <WordMeaning word={solution} entry={todayMeaning} />
      ) : (
        <Keyboard
          onChar={onChar}
          onDelete={onDelete}
          onEnter={onEnter}
          guesses={guesses}
          isSuggestWordModalOpen={isSuggestWordModalOpen}
          isConsentModalOpen={isConsentPending}
          showSnow={winterThemeActive}
          isDarkMode={isDarkMode}
        />
      )}
      <InfoModal
        isOpen={isInfoModalOpen}
        handleClose={() => setIsInfoModalOpen(false)}
      />
      <StatsModal
        isOpen={isStatsModalOpen}
        handleClose={() => setIsStatsModalOpen(false)}
        guesses={guesses}
        gameStats={stats}
        isGameLost={isGameLost}
        isGameWon={isGameWon}
        todaySolveTimeMs={todaySolveTimeMs}
        isTimeTrackingEnabled={isTimeTrackingEnabled}
        community={community}
        handleShare={() => {
          setSuccessAlert(GAME_COPIED_MESSAGE)
          return setTimeout(() => setSuccessAlert(''), ALERT_TIME_MS)
        }}
      />
      <SuggestWordModal
        isOpen={isSuggestWordModalOpen}
        handleClose={() => setIsSuggestWordModalOpen(false)}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        handleClose={() => setIsAboutModalOpen(false)}
      />
      <PravopisLinkModal
        isOpen={isPravopisLinkModalOpen}
        handleClose={() => setIsPravopisLinkModalOpen(false)}
      />
      <WomensDayModal
        isOpen={isWomensDayModalOpen}
        handleClose={() => setIsWomensDayModalOpen(false)}
      />
      <WordlistUpdateModal
        isOpen={isWordlistUpdateModalOpen}
        handleClose={() => setIsWordlistUpdateModalOpen(false)}
      />
      <TimeTrackingConsentModal
        isOpen={isConsentModalVisible}
        handleEnable={handleEnableTimeTracking}
        handleDisable={handleDisableTimeTracking}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        handleClose={() => setIsSettingsModalOpen(false)}
        isDarkMode={isDarkMode}
        handleDarkMode={handleDarkMode}
        isTimeTrackingEnabled={isTimeTrackingEnabled}
        handleTimeTracking={handleTimeTracking}
        handleRefresh={() => window.location.reload()}
      />

      <button
        type="button"
        className="mx-auto mt-2 flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 select-none"
        onClick={() => setIsAboutModalOpen(true)}
      >
        {ABOUT_GAME_MESSAGE}
      </button>
      <Alert message={NOT_ENOUGH_LETTERS_MESSAGE} isOpen={isNotEnoughLetters} />
      <Alert
        message={WORD_NOT_FOUND_MESSAGE}
        isOpen={isWordNotFoundAlertOpen}
      />
      <Alert message={CORRECT_WORD_MESSAGE(solution)} isOpen={isGameLost} />
      <Alert
        message={successAlert}
        isOpen={successAlert !== ''}
        variant="success"
      />
    </div>
  )
}

export default App
