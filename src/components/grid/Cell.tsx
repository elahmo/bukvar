import { CharStatus } from '../../lib/statuses'
import classnames from 'classnames'
import { useEffect, useState } from 'react'

type Props = {
  value?: string
  status?: CharStatus
}

export const Cell = ({ value, status }: Props) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const classes = classnames(
    `${
      windowWidth <= 375 ? 'w-10 h-10 text-2xl' : 'w-14 h-14 text-4xl' // 375 is the width of an iPhone 12 mini (the phone I use)
    } border-solid border-2 flex items-center justify-center mx-0.5  font-bold rounded dark:text-white`,
    {
      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600':
        !status,
      'border-black dark:border-slate-100': value && !status,
      'shadowed bg-slate-400 dark:bg-slate-700 text-white border-slate-400 dark:border-slate-700':
        status === 'absent',
      'shadowed bg-blue-500 text-white border-blue-500': status === 'correct',
      'shadowed bg-orange-500 dark:bg-orange-700 text-white border-orange-500 dark:border-orange-700':
        status === 'present',
      'cell-animation': !!value,
    }
  )

  return <div className={classes}>{value}</div>
}
