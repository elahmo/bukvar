import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const AboutModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="O igri" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Ovo je verzija popularne igre na bosanskom jeziku -{' '}
        <a
          href="https://github.com/elahmo/bukvar"
          className="underline font-bold"
        >
          pogledaj izvorni kod ovdje
        </a>{' '}
        <br />
        Igra se prije zvala drugačije, ali radi pravnih razloga manje izmjene su se morale desiti.
        <br />
        <br />
        Nova riječ svaki dan!
      </p>
    </BaseModal>
  )
}
