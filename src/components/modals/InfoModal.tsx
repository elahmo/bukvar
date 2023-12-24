import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="Kako igrati?" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Pogodi riječ u 6 pokušaja. Nakon svakog pokušaja, boje na ploči će se
        promijeniti da ti pokažu koliko si blizu pravoj riječi.
      </p>
      <div className="flex justify-center mb-1 mt-4">
        <Cell value="P" status="correct" />
        <Cell value="A" />
        <Cell value="Ž" />
        <Cell value="Ǌ" />
        <Cell value="A" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Riječ sadrži slovo P i na pravom je mjestu.
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell value="B" />
        <Cell value="I" />
        <Cell value="Ǉ" status="present" />
        <Cell value="K" />
        <Cell value="A" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Riječ sadrži slovo Ǉ, ali je na pogrešnom mjestu.
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell value="L" />
        <Cell value="O" />
        <Cell value="P" />
        <Cell value="T" status="absent" />
        <Cell value="A" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Riječ ne sadrži slovo T.
      </p>
    </BaseModal>
  )
}
