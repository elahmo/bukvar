import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const WordlistUpdateModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal
      title="Bukvar je osvježen! 🎉"
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Osvježili smo listu riječi! Dodali smo{' '}
        <strong style={{ fontWeight: 'bold' }}>mnogo novih riječi</strong> i
        izbacili neke sporne. Prijedlozi su i dalje dobrodošli, a tu je i nova
        statistika koja prikazuje koliko osoba je igralo i pogodilo/promašilo
        riječ!
        <br />
        <br />
        Redoslijed riječi je kao i do sada{' '}
        <strong style={{ fontWeight: 'bold' }}>nasumičan</strong>, ali zbog
        izmjene liste riječi, riječ koja se nedavno pojavila može ponovo
        pojaviti.
      </p>
      <div className="mt-4">
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          onClick={handleClose}
        >
          Idemo!
        </button>
      </div>
    </BaseModal>
  )
}
