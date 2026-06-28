import classNames from 'classnames'

type Props = {
  index: number
  size: number // your bar width contribution (0..~90)
  label: string
  ghostSize?: number // community bar width (0..~90), drawn faintly behind
  highlight?: boolean // today's solved row -> orange
}

export const Progress = ({ index, size, label, ghostSize, highlight }: Props) => {
  return (
    <div className="flex justify-left m-1 items-center">
      <div
        className={classNames('items-center justify-center w-2', {
          'text-orange-500 font-bold': highlight,
        })}
      >
        {index + 1}
      </div>
      <div className="relative rounded-full w-full ml-2">
        {ghostSize !== undefined && (
          <div
            style={{ width: `${5 + ghostSize}%` }}
            className="absolute inset-y-0 left-0 bg-slate-400 opacity-30 rounded-l-full"
          />
        )}
        <div
          style={{ width: `${5 + size}%` }}
          className={classNames(
            'relative text-xs font-medium text-center p-0.5 rounded-l-full',
            highlight ? 'bg-orange-500 text-white' : 'bg-blue-600 text-blue-100'
          )}
        >
          {label}
        </div>
      </div>
    </div>
  )
}
