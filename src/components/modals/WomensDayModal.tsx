import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const WomensDayModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal
      title="Sretan Dan žena!"
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Danas, 8. marta, obilježavamo Međunarodni dan žena!
        <br />
        🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹
        <br />
        Želimo čestitati svim ženama ovaj poseban dan i zahvaliti im na svemu
        što čine. Vaša snaga, hrabrost i doprinos društvu su neprocjenjivi.
        <br />
        🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹
        <br />
        Nastavite igrati Bukvar i uživajte u svom danu!
      </p>
      <div className="mt-4">
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:text-sm"
          onClick={handleClose}
        >
          Žena! Majka! Kraljica!
        </button>
      </div>
    </BaseModal>
  )
}
