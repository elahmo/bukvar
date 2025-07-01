import {
  ChartBarIcon,
  GiftIcon,
  InformationCircleIcon,
  PlusCircleIcon,
  RefreshIcon,
  SunIcon,
} from '@heroicons/react/outline'
import Plausible from 'plausible-tracker'
import { useEffect, useState } from 'react'
import './App.css'
import { Alert } from './components/alerts/Alert'
import ConfettiExplosion from 'react-confetti-explosion'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { AboutModal } from './components/modals/AboutModal'
import { BirthdayModal } from './components/modals/BirthdayModal'
import { InfoModal } from './components/modals/InfoModal'
import { StatsModal } from './components/modals/StatsModal'
import { SuggestWordModal } from './components/modals/SuggestWordModal'
import { PravopisLinkModal } from './components/modals/PravopisLinkModal'
import { WomensDayModal } from './components/modals/WomensDayModal'
import {
  ABOUT_GAME_MESSAGE,
  CORRECT_WORD_MESSAGE,
  GAME_COPIED_MESSAGE,
  GAME_TITLE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WIN_MESSAGES,
  WORD_NOT_FOUND_MESSAGE,
} from './constants/strings'
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
} from './lib/localStorage'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import { isWinningWord, isWordInWordList, solution } from './lib/words'

const ALERT_TIME_MS = 3000

function App() {
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isPravopisLinkModalOpen, setIsPravopisLinkModalOpen] = useState(false)
  const [isWomensDayModalOpen, setIsWomensDayModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [confettiTriggers, setConfettiTriggers] = useState<number[]>([])
  const [confettiClickCount, setConfettiClickCount] = useState(0)
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false)
  const [isNotEnoughLetters, setIsNotEnoughLetters] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
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

  const plausible = Plausible({
    domain: 'elahmo.github.io',
    apiHost: 'https://plausible.novalic.xyz',
  })

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

  useEffect(() => {
    if (shouldShowPravopisLink()) {
      setIsPravopisLinkModalOpen(true)
      localStorage.setItem('pravopisLinkLastShown', new Date().toISOString())
    }

    // Check if it's International Women's Day
    if (isInternationalWomensDay()) {
      setIsWomensDayModalOpen(true)
    }

    // Auto-refresh check for new day - only on fresh page loads
    const today = new Date().toDateString()
    const lastVisit = localStorage.getItem('lastVisitDate')

    // Only refresh if this is a fresh page load AND date changed
    if (
      lastVisit &&
      lastVisit !== today &&
      !sessionStorage.getItem('gameSessionActive')
    ) {
      window.location.reload()
      return
    }

    localStorage.setItem('lastVisitDate', today)
    sessionStorage.setItem('gameSessionActive', 'true')

    // Set up interval to check for midnight refresh for long-running sessions
    const midnightCheck = setInterval(() => {
      const currentDate = new Date().toDateString()
      const storedDate = localStorage.getItem('lastVisitDate')

      if (storedDate && storedDate !== currentDate) {
        window.location.reload()
      }
    }, 60000) // Check every minute

    return () => clearInterval(midnightCheck)
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, solution })
  }, [guesses])

  useEffect(() => {
    if (isGameWon) {
      setSuccessAlert(
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
      )
      setTimeout(() => {
        setSuccessAlert('')
        setIsStatsModalOpen(true)
      }, ALERT_TIME_MS)
    }
    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true)
      }, ALERT_TIME_MS)
    }
  }, [isGameWon, isGameLost])

  const onChar = (value: string) => {
    if (currentGuess.length < 5 && guesses.length < 6 && !isGameWon) {
      setCurrentGuess(`${currentGuess}${value}`)
      plausible.trackEvent('char', { props: { char: value } })
    }
  }

  const onDelete = () => {
    setCurrentGuess(currentGuess.slice(0, -1))
  }

  const onEnter = () => {
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
        setStats(addStatsForCompletedGame(stats, guesses.length))
        plausible.trackEvent('gameWon', {
          props: { guesses: `${guesses.length}`, word: currentGuess },
        })
        return setIsGameWon(true)
      }

      if (guesses.length === 5) {
        setStats(addStatsForCompletedGame(stats, guesses.length + 1))
        plausible.trackEvent('gameLost', { props: { word: currentGuess } })
        setIsGameLost(true)
      }
    }
  }

  return (
    <div className="py-2 max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="flex w-80 mx-auto items-center mb-2 mt-2">
        <h1 className="text-xl ml-2.5 grow font-bold dark:text-white">
          {GAME_TITLE}
        </h1>
        <PlusCircleIcon
          className="h-5 w-5 mr-2 cursor-pointer dark:stroke-white"
          onClick={() => setIsSuggestWordModalOpen(true)}
        />
        <SunIcon
          className="h-5 w-5 mr-2 cursor-pointer dark:stroke-white"
          onClick={() => handleDarkMode(!isDarkMode)}
        />
        <RefreshIcon
          className="h-5 w-5 mr-2 cursor-pointer dark:stroke-white"
          onClick={() => window.location.reload()}
        />
        <InformationCircleIcon
          className="h-5 w-5 mr-2 cursor-pointer dark:stroke-white"
          onClick={() => setIsInfoModalOpen(true)}
        />
        <ChartBarIcon
          className="h-5 w-5 mr-2 cursor-pointer dark:stroke-white"
          onClick={() => setIsStatsModalOpen(true)}
        />
        <GiftIcon
          className="h-6 w-6 mr-2 cursor-pointer animate-bounce text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300"
          style={{
            animation: 'colorfulPulse 2s ease-in-out infinite',
          }}
          onClick={() => {
            setConfettiTriggers((prev) => [...prev, Date.now() + Math.random()])
            const newCount = confettiClickCount + 1
            setConfettiClickCount(newCount)
            setIsBirthdayModalOpen(true)
          }}
        />
      </div>
      <Grid guesses={guesses} currentGuess={currentGuess} />
      <Keyboard
        onChar={onChar}
        onDelete={onDelete}
        onEnter={onEnter}
        guesses={guesses}
        isSuggestWordModalOpen={isSuggestWordModalOpen}
      />
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
      <BirthdayModal
        isOpen={isBirthdayModalOpen}
        handleClose={() => setIsBirthdayModalOpen(false)}
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
      {confettiTriggers.map((trigger) => (
        <div
          key={trigger}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          <ConfettiExplosion
            force={0.8}
            duration={6000}
            particleCount={300}
            width={window.innerWidth}
            height={window.innerHeight}
            zIndex={1000}
            colors={[
              '#ff6b6b',
              '#4ecdc4',
              '#45b7d1',
              '#f9ca24',
              '#f0932b',
              '#eb4d4b',
              '#6c5ce7',
              '#a55eea',
              '#26de81',
              '#fd79a8',
            ]}
            onComplete={() =>
              setConfettiTriggers((prev) => prev.filter((t) => t !== trigger))
            }
          />
        </div>
      ))}
    </div>
  )
}

export default App
