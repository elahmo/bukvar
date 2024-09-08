// src/components/modals/ProjectLinkModal.tsx
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const PravopisLinkModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal
      title="Novo! Novo! Novo!"
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Za sve ljubitelje bukvara, tu je nešto novo i uzbudljivo:{' '}
        <strong className="shinyText" style={{ fontWeight: 'bold' }}>
          Pravopis
        </strong>
        !
        <br />
        <br />
        Klikom na dugme ispod se otvara nova stranica, gdje možeš u svako doba
        dana i noći provjeriti kako se riječi ispravno pišu. Baci pogled, javi
        ako nešto ne funkcioniše i jačajmo naš pravopis zajedno.
      </p>
      <div className="mt-4">
        <a
          href="https://pravopis.novalic.xyz"
          target="_blank"
          className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          onClick={handleClose}
        >
          Klikni ovdje!
        </a>
      </div>
    </BaseModal>
  )
}
