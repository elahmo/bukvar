import { render, screen, fireEvent } from '@testing-library/react'
import { SettingsModal } from './SettingsModal'
import {
  SETTINGS_TITLE,
  DARK_MODE_TEXT,
  TIME_TRACKING_SETTING_TEXT,
  REFRESH_SETTING_TEXT,
} from '../../constants/strings'

const renderModal = (overrides = {}) => {
  const props = {
    isOpen: true,
    handleClose: jest.fn(),
    isDarkMode: false,
    handleDarkMode: jest.fn(),
    isTimeTrackingEnabled: false,
    handleTimeTracking: jest.fn(),
    handleRefresh: jest.fn(),
    ...overrides,
  }
  render(<SettingsModal {...props} />)
  return props
}

describe('SettingsModal', () => {
  test('renders title and both toggles when open', () => {
    renderModal()
    expect(screen.getByText(SETTINGS_TITLE)).toBeInTheDocument()
    expect(screen.getByText(DARK_MODE_TEXT)).toBeInTheDocument()
    expect(screen.getByText(TIME_TRACKING_SETTING_TEXT)).toBeInTheDocument()
  })

  test('does not render when closed', () => {
    renderModal({ isOpen: false })
    expect(screen.queryByText(SETTINGS_TITLE)).not.toBeInTheDocument()
  })

  test('dark mode toggle calls handleDarkMode with the flipped value', () => {
    const props = renderModal({ isDarkMode: false })
    fireEvent.click(screen.getByRole('switch', { name: DARK_MODE_TEXT }))
    expect(props.handleDarkMode).toHaveBeenCalledWith(true)
  })

  test('dark mode toggle turns off when currently on', () => {
    const props = renderModal({ isDarkMode: true })
    fireEvent.click(screen.getByRole('switch', { name: DARK_MODE_TEXT }))
    expect(props.handleDarkMode).toHaveBeenCalledWith(false)
  })

  test('time tracking toggle calls handleTimeTracking with the flipped value', () => {
    const props = renderModal({ isTimeTrackingEnabled: false })
    fireEvent.click(
      screen.getByRole('switch', { name: TIME_TRACKING_SETTING_TEXT })
    )
    expect(props.handleTimeTracking).toHaveBeenCalledWith(true)
  })

  test('time tracking toggle turns off when currently on', () => {
    const props = renderModal({ isTimeTrackingEnabled: true })
    fireEvent.click(
      screen.getByRole('switch', { name: TIME_TRACKING_SETTING_TEXT })
    )
    expect(props.handleTimeTracking).toHaveBeenCalledWith(false)
  })

  test('toggles reflect the current state via aria-checked', () => {
    renderModal({ isDarkMode: true, isTimeTrackingEnabled: false })
    expect(
      screen.getByRole('switch', { name: DARK_MODE_TEXT })
    ).toHaveAttribute('aria-checked', 'true')
    expect(
      screen.getByRole('switch', { name: TIME_TRACKING_SETTING_TEXT })
    ).toHaveAttribute('aria-checked', 'false')
  })

  test('renders the refresh row and calls handleRefresh on click', () => {
    const props = renderModal()
    fireEvent.click(screen.getByRole('button', { name: REFRESH_SETTING_TEXT }))
    expect(props.handleRefresh).toHaveBeenCalledTimes(1)
  })
})
