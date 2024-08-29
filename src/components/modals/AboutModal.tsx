import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const AboutModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="O igri" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Ovo je verzija popularne igre na bosanskom jeziku. Više informacija o
        igri na {' '}
        <a
          href="https://novalic.xyz/projects/#bukvar"
          className="underline font-bold"
        >
        ovoj adresi
        </a>. Ukoliko želiš pomoći, javi se autoru ili pogledaj izvorni kod {' '}
        <a
          href="https://github.com/elahmo/bukvar"
          className="underline font-bold"
        >
          ovdje
        </a>.{' '} 
        <br /><br />
        Nova riječ svaki dan!

      </p>
    </BaseModal>
  )
}
