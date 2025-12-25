import { ReactNode, useMemo } from 'react'
import classnames from 'classnames'
import { KeyValue } from '../../lib/keyboard'
import { CharStatus } from '../../lib/statuses'

type Props = {
  children?: ReactNode
  value: KeyValue
  width?: number
  status?: CharStatus
  onClick: (value: KeyValue) => void
  showSnow?: boolean
  isDarkMode?: boolean
}

// Generate a simple hash from string for consistent randomness per key
const hashCode = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

// Generate snow cap path with bumps based on key value
const generateSnowPath = (keyValue: string, keyWidth: number): string => {
  const hash = hashCode(keyValue)
  const bumps = 3 + (hash % 3) // 3-5 bumps
  const points: string[] = []

  // Start bottom-left, flat bottom edge, then bumpy top
  points.push('M0,8 L0,5')

  let currentX = 0
  for (let i = 0; i < bumps; i++) {
    const segmentWidth = keyWidth / bumps
    const nextX = currentX + segmentWidth
    const peak = 1 + ((hash >> (i * 3)) % 3) // peaks at y 1-3 (higher up)
    const midX = currentX + segmentWidth / 2
    const endY = 4 + ((hash >> (i * 2)) % 2) // end points at y 4-5
    points.push(`Q${midX},${peak} ${nextX},${endY}`)
    currentX = nextX
  }

  // Close the path
  points.push('L' + keyWidth + ',8 Z')

  return points.join(' ')
}

export const Key = ({
  children,
  status,
  width = 40,
  value,
  onClick,
  showSnow = false,
  isDarkMode = false,
}: Props) => {
  const snowPath = useMemo(() => generateSnowPath(value, width), [value, width])
  const snowColorTop = isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(140,170,200,0.85)'
  const snowColorBottom = isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(140,170,200,0.3)'
  const classes = classnames(
    'flex items-center justify-center rounded mx-0.5 text-xs font-bold cursor-pointer select-none dark:text-white',
    {
      'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 active:bg-slate-400':
        !status,
      'bg-slate-400 dark:bg-slate-800 text-white': status === 'absent',
      'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white':
        status === 'correct',
      'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 dark:bg-orange-700 text-white':
        status === 'present',
      'bg-green-500 hover:bg-green-600 active:bg-green-700 dark:bg-green-700 text-white':
        status === 'enter',
      'bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-700 text-white':
        status === 'delete',
    }
  )

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick(value)
    event.currentTarget.blur()
  }

  return (
    <button
      style={{ width: `${width}px`, height: '50px' }}
      className={`${classes} relative`}
      onClick={handleClick}
    >
      {showSnow && (
        <svg
          className="absolute left-0 pointer-events-none"
          style={{ top: '-5px' }}
          width={width}
          height="8"
          viewBox={`0 0 ${width} 8`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`snow-${value}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={snowColorTop} />
              <stop offset="100%" stopColor={snowColorBottom} />
            </linearGradient>
          </defs>
          <path d={snowPath} fill={`url(#snow-${value})`} />
        </svg>
      )}
      {children || value}
    </button>
  )
}
