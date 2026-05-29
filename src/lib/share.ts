import { getGuessStatuses } from './statuses'
import { formatTime } from './timer'
import { solutionIndex } from './words'

export const buildShareText = (
  guesses: string[],
  lost: boolean,
  solveTimeMs: number | null
) => {
  const header = `Bukvar ${solutionIndex} ${lost ? 'X' : guesses.length}/6`
  const grid = generateEmojiGrid(guesses)
  const footer =
    solveTimeMs !== null && solveTimeMs > 0
      ? `\n\n⏱ ${formatTime(solveTimeMs)}`
      : ''
  return `${header}\n\n${grid}${footer}`
}

export const shareStatus = (
  guesses: string[],
  lost: boolean,
  solveTimeMs: number | null = null
) => {
  const shareText = buildShareText(guesses, lost, solveTimeMs)
  navigator.clipboard.writeText(shareText)

  const shareData = {
    text: shareText,
  }
  navigator.share(shareData)
}

export const generateEmojiGrid = (guesses: string[]) => {
  return guesses
    .map((guess) => {
      const status = getGuessStatuses(guess)
      return guess
        .split('')
        .map((_letter, i) => {
          switch (status[i]) {
            case 'correct':
              return '🟩'
            case 'present':
              return '🟨'
            default:
              return '⬜'
          }
        })
        .join('')
    })
    .join('\n')
}
