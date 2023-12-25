import { BaseModal } from './BaseModal'
import { useState } from 'react'
import { isWordPresent } from '../../lib/words'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const SuggestWordModal = ({ isOpen, handleClose }: Props) => {
  const [word, setWord] = useState('')

  const handleSubmit = () => {
    const apiUrl = 'https://forms.novalic.xyz/words'

    if (isWordPresent(word)) {
      alert('Riječ već postoji!')
      return
    }

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: word }),
    })
      .then((response) => {
        alert('Riječ je uspješno poslana!')
        setWord('')
      })
      .catch((error) => {
        alert('Desio se problemčić, pokušaj kasnije!')
      })
  }

  return (
    <BaseModal
      title="Predloži novu riječ"
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <p className="text-sm text-left text-gray-500 dark:text-gray-300">
        Ukoliko želiš da predložiš novu riječ koja će se pojaviti u igri, ispuni
        polje ispod i ukoliko je riječ ispravna, a trenutno nije na listi,
        pojaviće se na listi riječi uskoro.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="mt-4 w-full flex"
      >
        <input
          type="text"
          placeholder="Unesi novu riječ"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          pattern="[a-zA-ZčćžšđČĆŽŠĐ]+"
          minLength={5}
          maxLength={7}
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Pošalji
        </button>
      </form>
    </BaseModal>
  )
}
