import { WORDS } from '../constants/wordlist'
import { VALIDGUESSES } from '../constants/validGuesses'
import { getSpecialOccasionForDate, getSpecialOccasionWords } from '../constants/specialOccasions'

export const isWordInWordList = (word: string) => {
  const specialWords = getSpecialOccasionWords()
  return (
    WORDS.includes(word.toLowerCase()) ||
    VALIDGUESSES.includes(word.toLowerCase()) ||
    specialWords.includes(word.toLowerCase())
  )
}

export const isWordPresent = (word: string) => {
  const specialWords = getSpecialOccasionWords()
  return (
    WORDS.includes(word.toLowerCase()) ||
    specialWords.includes(word.toLowerCase())
  )
}

export const isWinningWord = (word: string) => {
  return solution === word
}

// Count how many special occasion days occurred between two dates
const countSpecialOccasionsBetweenDates = (startDate: Date, endDate: Date): number => {
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
  // December 28, 2023 00:00:00 local time
  const epoch = new Date(2023, 11, 28);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = start.getTime() - epoch.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  const nextday = new Date(start);
  nextday.setDate(start.getDate() + 1);

  // Check if today is a special occasion
  const specialOccasion = getSpecialOccasionForDate(start)
  
  if (specialOccasion) {
    // Use special occasion word, normal progression continues tomorrow
    return {
      solution: specialOccasion.word.toUpperCase(),
      solutionIndex: day,
      tomorrow: nextday.getTime(),
      specialOccasion: specialOccasion.name // Optional: expose the occasion name
    }
  }

  // Calculate regular word index by subtracting special occasion days
  const specialDaysCount = countSpecialOccasionsBetweenDates(epoch, start)
  const regularWordIndex = (day - specialDaysCount) % WORDS.length

  return {
    solution: WORDS[regularWordIndex].toUpperCase(),
    solutionIndex: day,
    tomorrow: nextday.getTime(),
  }
}

export const { solution, solutionIndex, tomorrow } = getWordOfDay()
