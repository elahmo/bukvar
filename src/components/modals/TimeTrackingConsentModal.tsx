import { BaseModal } from './BaseModal'
import {
  TIME_TRACKING_CONSENT_TITLE,
  TIME_TRACKING_CONSENT_BODY,
  TIME_TRACKING_CONSENT_BODY_2,
  TIME_TRACKING_CONSENT_HINT,
  TIME_TRACKING_CONSENT_ENABLE,
  TIME_TRACKING_CONSENT_DISABLE,
} from '../../constants/strings'

type Props = {
  isOpen: boolean
  handleEnable: () => void
  handleDisable: () => void
}

export const TimeTrackingConsentModal = ({
  isOpen,
  handleEnable,
  handleDisable,
}: Props) => {
  return (
    <BaseModal
      title={TIME_TRACKING_CONSENT_TITLE}
      isOpen={isOpen}
      handleClose={() => {}}
      dismissible={false}
    >
      <p className="text-sm text-gray-800 dark:text-gray-300">
        {TIME_TRACKING_CONSENT_BODY}
      </p>
      <p className="text-sm text-gray-500 mt-2 dark:text-gray-300">
        {TIME_TRACKING_CONSENT_BODY_2}
      </p>
      <p className="text-xs text-gray-400 mt-3 dark:text-gray-400">
        {TIME_TRACKING_CONSENT_HINT}
      </p>
      <div className="mt-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleEnable}
          className="w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
        >
          {TIME_TRACKING_CONSENT_ENABLE}
        </button>
        <button
          type="button"
          onClick={handleDisable}
          className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 sm:text-sm"
        >
          {TIME_TRACKING_CONSENT_DISABLE}
        </button>
      </div>
    </BaseModal>
  )
}
