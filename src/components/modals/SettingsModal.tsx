import { Switch } from '@headlessui/react'
import { RefreshIcon } from '@heroicons/react/outline'
import classNames from 'classnames'
import { BaseModal } from './BaseModal'
import {
  SETTINGS_TITLE,
  DARK_MODE_TEXT,
  TIME_TRACKING_SETTING_TEXT,
  TIME_TRACKING_SETTING_DESCRIPTION,
  REFRESH_SETTING_TEXT,
  REFRESH_SETTING_DESCRIPTION,
} from '../../constants/strings'

type Props = {
  isOpen: boolean
  handleClose: () => void
  isDarkMode: boolean
  handleDarkMode: (isDark: boolean) => void
  isTimeTrackingEnabled: boolean
  handleTimeTracking: (enabled: boolean) => void
  handleRefresh: () => void
}

const SettingToggle = ({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string
  description?: string
  enabled: boolean
  onChange: (enabled: boolean) => void
}) => {
  return (
    <div className="flex justify-between items-center gap-4 py-3">
      <div className="text-left">
        <p className="text-base text-gray-800 dark:text-gray-200">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {description}
          </p>
        )}
      </div>
      <Switch
        checked={enabled}
        onChange={onChange}
        aria-label={label}
        className={classNames(
          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
          enabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
            enabled ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </Switch>
    </div>
  )
}

export const SettingsModal = ({
  isOpen,
  handleClose,
  isDarkMode,
  handleDarkMode,
  isTimeTrackingEnabled,
  handleTimeTracking,
  handleRefresh,
}: Props) => {
  return (
    <BaseModal title={SETTINGS_TITLE} isOpen={isOpen} handleClose={handleClose}>
      <div className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
        <SettingToggle
          label={DARK_MODE_TEXT}
          enabled={isDarkMode}
          onChange={handleDarkMode}
        />
        <SettingToggle
          label={TIME_TRACKING_SETTING_TEXT}
          description={TIME_TRACKING_SETTING_DESCRIPTION}
          enabled={isTimeTrackingEnabled}
          onChange={handleTimeTracking}
        />
        <div className="flex justify-between items-center gap-4 py-3">
          <div className="text-left">
            <p className="text-base text-gray-800 dark:text-gray-200">
              {REFRESH_SETTING_TEXT}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {REFRESH_SETTING_DESCRIPTION}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            aria-label={REFRESH_SETTING_TEXT}
            className="flex-shrink-0 rounded-md border border-gray-300 shadow-sm p-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <RefreshIcon className="h-5 w-5 dark:stroke-white" />
          </button>
        </div>
      </div>
    </BaseModal>
  )
}
