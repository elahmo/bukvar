import { WORDS, LEGACY_WORDS } from '../constants/wordlist'

// Day index (see getWordOfDay) of the first day that uses the new, curated &
// randomized WORDS list: 2026-06-29 = "Bukvar 914". Earlier days keep the
// original sequential mapping over LEGACY_WORDS so already-played puzzles
// (including the live day 913 = PUMPA) are never retroactively changed.
const LAUNCH_INDEX = 914
import { VALIDGUESSES } from '../constants/validGuesses'
import {
  getSpecialOccasionForDate,
  getSpecialOccasionWords,
} from '../constants/specialOccasions'

export const isWordInWordList = (word: string) => {
  const specialWords = getSpecialOccasionWords()
  return (
    WORDS.includes(word.toLowerCase()) ||
    LEGACY_WORDS.includes(word.toLowerCase()) ||
    VALIDGUESSES.includes(word.toLowerCase()) ||
    specialWords.includes(word.toLowerCase())
  )
}

export const isWordPresent = (word: string) => {
  const specialWords = getSpecialOccasionWords()
  return (
    WORDS.includes(word.toLowerCase()) ||
    LEGACY_WORDS.includes(word.toLowerCase()) ||
    specialWords.includes(word.toLowerCase())
  )
}

export const isWinningWord = (word: string) => {
  return solution === word
}

// Count how many special occasion days occurred between two dates
const countSpecialOccasionsBetweenDates = (
  startDate: Date,
  endDate: Date
): number => {
  let count = 0
  const current = new Date(startDate)

  while (current < endDate) {
    if (getSpecialOccasionForDate(current)) {
      count++
    }
    current.setDate(current.getDate() + 1)
  }

  return count
}

export const getWordOfDay = () => {
  const epoch = new Date(2023, 11, 28)
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  // Use UTC to compute day index — avoids DST causing ±1h drift in local ms diff
  const msPerDay = 86400000
  const epochUTC = Date.UTC(2023, 11, 28)
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const day = Math.floor((todayUTC - epochUTC) / msPerDay)
  const nextday = new Date(start)
  nextday.setDate(start.getDate() + 1)

  // Check if today is a special occasion
  const specialOccasion = getSpecialOccasionForDate(start)

  if (specialOccasion) {
    // Use special occasion word, normal progression continues tomorrow
    return {
      solution: specialOccasion.word.toUpperCase(),
      solutionIndex: day,
      tomorrow: nextday.getTime(),
      specialOccasion: specialOccasion.name, // Optional: expose the occasion name
    }
  }

  // --- Pre-relaunch days (day < LAUNCH_INDEX) --------------------------------
  // Keep the original sequential mapping over LEGACY_WORDS. This is what was
  // live before the relaunch, so the still-active day 913 (= PUMPA) and all
  // historical puzzles resolve exactly as they always did. Double modulo keeps
  // the index positive even if a device clock is set before the epoch.
  if (day < LAUNCH_INDEX) {
    const specialDaysCount = countSpecialOccasionsBetweenDates(epoch, start)
    const legacyIndex =
      (((day - specialDaysCount) % LEGACY_WORDS.length) + LEGACY_WORDS.length) %
      LEGACY_WORDS.length
    return {
      solution: LEGACY_WORDS[legacyIndex].toUpperCase(),
      solutionIndex: day,
      tomorrow: nextday.getTime(),
    }
  }

  // --- Relaunch onward (2026-06-29+) -----------------------------------------
  // New curated, pre-shuffled WORDS list. Index from the launch day so day 914
  // is WORDS[0]; subtract special-occasion days since launch so the shuffled
  // sequence isn't skipped on days a special word takes over.
  const launchDate = new Date(epoch)
  launchDate.setDate(epoch.getDate() + LAUNCH_INDEX)
  const specialDaysSinceLaunch = countSpecialOccasionsBetweenDates(
    launchDate,
    start
  )
  const wordIndex =
    (((day - LAUNCH_INDEX - specialDaysSinceLaunch) % WORDS.length) +
      WORDS.length) %
    WORDS.length

  return {
    solution: WORDS[wordIndex].toUpperCase(),
    solutionIndex: day,
    tomorrow: nextday.getTime(),
  }
}

export const { solution, solutionIndex, tomorrow } = getWordOfDay()
