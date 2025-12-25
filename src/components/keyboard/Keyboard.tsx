import { KeyValue } from '../../lib/keyboard'
import { getStatuses } from '../../lib/statuses'
import { Key } from './Key'
import { useEffect } from 'react'
import { ENTER_TEXT, DELETE_TEXT } from '../../constants/strings'

type Props = {
  onChar: (value: string) => void
  onDelete: () => void
  onEnter: () => void
  guesses: string[]
  isSuggestWordModalOpen: boolean
  showSnow?: boolean
  isDarkMode?: boolean
}

export const Keyboard = ({
  onChar,
  onDelete,
  onEnter,
  guesses,
  isSuggestWordModalOpen,
  showSnow = false,
  isDarkMode = false,
}: Props) => {
  const charStatuses = getStatuses(guesses)

  const onClick = (value: KeyValue) => {
    if (value === 'ENTER') {
      onEnter()
    } else if (value === 'DELETE') {
      onDelete()
    } else {
      onChar(value)
    }
  }

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (isSuggestWordModalOpen) {
        return
      }
      if (e.code === 'Enter') {
        onEnter()
      } else if (e.code === 'Backspace') {
        onDelete()
      } else {
        const key = e.key.toUpperCase()
        if (
          key.length === 1 &&
          ((key >= 'A' && key <= 'Z') ||
            key === 'Č' ||
            key === 'Ć' ||
            key === 'Š' ||
            key === 'Ž' ||
            key === 'Đ')
        ) {
          onChar(key)
        }
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
  }, [onEnter, onDelete, onChar, isSuggestWordModalOpen])

  return (
    <div className="ml-2.5 mr-2.5 relative">
      <div className="flex justify-center mb-1">
        <Key value="E" onClick={onClick} status={charStatuses['E']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="R" onClick={onClick} status={charStatuses['R']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="T" onClick={onClick} status={charStatuses['T']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="Z" onClick={onClick} status={charStatuses['Z']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="U" onClick={onClick} status={charStatuses['U']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="I" onClick={onClick} status={charStatuses['I']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="O" onClick={onClick} status={charStatuses['O']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="P" onClick={onClick} status={charStatuses['P']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="Š" onClick={onClick} status={charStatuses['Š']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="Đ" onClick={onClick} status={charStatuses['Đ']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="Ǆ" onClick={onClick} status={charStatuses['Ǆ']} showSnow={showSnow} isDarkMode={isDarkMode} />
      </div>
      <div className="flex justify-center mb-1">
        <Key value="A" onClick={onClick} status={charStatuses['A']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="S" onClick={onClick} status={charStatuses['S']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="D" onClick={onClick} status={charStatuses['D']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="F" onClick={onClick} status={charStatuses['F']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="G" onClick={onClick} status={charStatuses['G']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="H" onClick={onClick} status={charStatuses['H']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="J" onClick={onClick} status={charStatuses['J']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="K" onClick={onClick} status={charStatuses['K']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="L" onClick={onClick} status={charStatuses['L']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="Ǉ" onClick={onClick} status={charStatuses['Ǉ']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="Č" onClick={onClick} status={charStatuses['Č']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="Ć" onClick={onClick} status={charStatuses['Ć']} showSnow={showSnow} isDarkMode={isDarkMode} />
      </div>
      <div className="flex justify-center">
        <Key width={65.4} value="ENTER" onClick={onClick} status="enter" showSnow={showSnow} isDarkMode={isDarkMode}>
          {ENTER_TEXT}
        </Key>
        <Key value="C" onClick={onClick} status={charStatuses['C']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="V" onClick={onClick} status={charStatuses['V']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="B" onClick={onClick} status={charStatuses['B']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="N" onClick={onClick} status={charStatuses['N']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="Ǌ" onClick={onClick} status={charStatuses['Ǌ']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="M" onClick={onClick} status={charStatuses['M']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key value="Ž" onClick={onClick} status={charStatuses['Ž']} showSnow={showSnow} isDarkMode={isDarkMode} />
        <Key width={65.4} value="DELETE" onClick={onClick} status="delete" showSnow={showSnow} isDarkMode={isDarkMode}>
          {DELETE_TEXT}
        </Key>
      </div>
    </div>
  )
}
