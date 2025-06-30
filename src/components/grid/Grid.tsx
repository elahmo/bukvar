import { CompletedRow } from './CompletedRow'
import { CurrentRow } from './CurrentRow'
import { EmptyRow } from './EmptyRow'

type Props = {
  guesses: string[]
  currentGuess: string
}

export const Grid = ({ guesses, currentGuess }: Props) => {
  const empties =
    guesses.length < 5 ? Array.from(Array(5 - guesses.length)) : []

  return (
    <div className="pb-2 relative">
      <div className="p-4 relative overflow-hidden">
        <div className="sparkle" style={{top: '10px', left: '20px'}}></div>
        <div className="sparkle" style={{top: '30px', right: '25px'}}></div>
        <div className="sparkle" style={{bottom: '15px', left: '30px'}}></div>
        <div className="sparkle" style={{bottom: '25px', right: '15px'}}></div>
        <div className="sparkle" style={{top: '50%', left: '10px'}}></div>
        {guesses.map((guess, i) => (
          <CompletedRow key={i} guess={guess} />
        ))}
        {guesses.length < 6 && <CurrentRow guess={currentGuess} />}
        {empties.map((_, i) => (
          <EmptyRow key={i} />
        ))}
      </div>
    </div>
  )
}
