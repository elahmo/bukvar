import { WORDS } from '../constants/wordlist'
import { VALIDGUESSES } from '../constants/validGuesses'

export const isWordInWordList = (word: string) => {
  return (
    WORDS.includes(word.toLowerCase()) ||
    VALIDGUESSES.includes(word.toLowerCase())
  )
}

export const isWordPresent = (word: string) => {
  return WORDS.includes(word.toLowerCase())
}

export const isWinningWord = (word: string) => {
  return solution === word
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

  return {
    solution: WORDS[day % WORDS.length].toUpperCase(),
    solutionIndex: day,
    tomorrow: nextday.getTime(),
  }
}

export const { solution, solutionIndex, tomorrow } = getWordOfDay()
