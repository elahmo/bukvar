import { WordDefinition } from '../constants/wordDefinitions'

type Props = {
  /** The day's solution, already uppercased (matches the board). */
  word: string
  entry: WordDefinition
}

// Shown after the game ends, in the slot the (now-useless) keyboard occupied.
// Renders nothing-special chrome — just the meaning of the word you solved.
export const WordMeaning = ({ word, entry }: Props) => {
  return (
    <div className="meaning-reveal relative mx-auto mt-1 mb-2 w-full max-w-sm rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-left dark:border-slate-700 dark:bg-slate-800/60">
      <span
        className="absolute left-0 top-3 bottom-3 w-1 rounded bg-amber-400"
        aria-hidden="true"
      />
      <p className="pl-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        Značenje
      </p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 pl-2">
        <span className="text-lg font-extrabold tracking-wide text-gray-900 dark:text-white">
          {word}
        </span>
        {entry.pos && (
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
            {entry.pos}
          </span>
        )}
        {entry.note && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            {entry.note}
          </span>
        )}
      </div>
      <p className="mt-1.5 pl-2 text-sm leading-snug text-gray-700 dark:text-gray-200">
        {entry.def}
      </p>
    </div>
  )
}
