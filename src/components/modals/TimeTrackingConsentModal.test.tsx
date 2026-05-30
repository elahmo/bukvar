import { render, screen, fireEvent } from '@testing-library/react'
import { TimeTrackingConsentModal } from './TimeTrackingConsentModal'
import {
  TIME_TRACKING_CONSENT_TITLE,
  TIME_TRACKING_CONSENT_BODY,
  TIME_TRACKING_CONSENT_ENABLE,
  TIME_TRACKING_CONSENT_DISABLE,
} from '../../constants/strings'

describe('TimeTrackingConsentModal', () => {
  test('renders title, body, and both buttons when open', () => {
    render(
      <TimeTrackingConsentModal
        isOpen={true}
        handleEnable={() => {}}
        handleDisable={() => {}}
      />
    )
    expect(screen.getByText(TIME_TRACKING_CONSENT_TITLE)).toBeInTheDocument()
    expect(screen.getByText(TIME_TRACKING_CONSENT_BODY)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: TIME_TRACKING_CONSENT_ENABLE })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: TIME_TRACKING_CONSENT_DISABLE })
    ).toBeInTheDocument()
  })

  test('does not render when closed', () => {
    render(
      <TimeTrackingConsentModal
        isOpen={false}
        handleEnable={() => {}}
        handleDisable={() => {}}
      />
    )
    expect(
      screen.queryByText(TIME_TRACKING_CONSENT_TITLE)
    ).not.toBeInTheDocument()
  })

  test('calls handleEnable when the enable button is clicked', () => {
    const handleEnable = jest.fn()
    const handleDisable = jest.fn()
    render(
      <TimeTrackingConsentModal
        isOpen={true}
        handleEnable={handleEnable}
        handleDisable={handleDisable}
      />
    )
    fireEvent.click(
      screen.getByRole('button', { name: TIME_TRACKING_CONSENT_ENABLE })
    )
    expect(handleEnable).toHaveBeenCalledTimes(1)
    expect(handleDisable).not.toHaveBeenCalled()
  })

  test('calls handleDisable when the disable button is clicked', () => {
    const handleEnable = jest.fn()
    const handleDisable = jest.fn()
    render(
      <TimeTrackingConsentModal
        isOpen={true}
        handleEnable={handleEnable}
        handleDisable={handleDisable}
      />
    )
    fireEvent.click(
      screen.getByRole('button', { name: TIME_TRACKING_CONSENT_DISABLE })
    )
    expect(handleDisable).toHaveBeenCalledTimes(1)
    expect(handleEnable).not.toHaveBeenCalled()
  })

  test('does not render the X close button (force-choice modal)', () => {
    const { container } = render(
      <TimeTrackingConsentModal
        isOpen={true}
        handleEnable={() => {}}
        handleDisable={() => {}}
      />
    )
    const closeButton = container.querySelector('svg.h-6.w-6.cursor-pointer')
    expect(closeButton).not.toBeInTheDocument()
  })
})
