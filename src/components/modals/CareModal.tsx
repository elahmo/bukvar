import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const CareModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="Porodica je osnovna ćelija društva" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-left text-gray-500 dark:text-gray-300">
        Pokažite vašim najmilijima da ih cijenite, podržavate i da se brinete o njima. Uspjehe slavite zajedno i <strong>uvijek budite tu</strong> jedni za druge. <br /><br />
        Kad god dođe do nesuglasica, riješite ih na miran i pošten način. Ponekad se, čak i kad si u pravu, treba povući iz rasprave - to pokazuje veliku zrelost i odgovornost. <br /><br />
      </p>
      <p className="text-md text-center text-gray-500 dark:text-gray-300"><strong>Neka porodica uvijek bude vaša najvažnija podrška i sigurna luka.</strong></p>
    </BaseModal>
  )
}
