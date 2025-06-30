import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const BirthdayModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal
      title="🎉 Čestitke! 🎂"
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <div className="text-center">
        <div className="text-6xl mb-4">🎂</div>
        <p className="text-lg mb-4 dark:text-white">
          Možeš reći <strong>Sretan rođendan Ahmet</strong>u i dobiti komad{' '}
          <strong>torte</strong>! 🍰
        </p>
        <div className="text-4xl mb-4">🧀🍰✨</div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Pronašao si tajni rođendanski događaj! 🎊
        </p>
      </div>
    </BaseModal>
  )
}
