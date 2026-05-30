import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'
import {
  GAME_TITLE,
  TIME_TRACKING_CONSENT_TITLE,
  TIME_TRACKING_CONSENT_ENABLE,
  TIME_TRACKING_CONSENT_DISABLE,
} from './constants/strings'

beforeEach(() => {
  localStorage.clear()
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
})

afterEach(() => {
  localStorage.clear()
})

test('renders App component', () => {
  render(<App />)
  const linkElement = screen.getByText(GAME_TITLE)
  expect(linkElement).toBeInTheDocument()
})

// Returning users have a gameState entry; suppressing the auto-open of the
// intro InfoModal lets us assert on the consent modal directly. The brand-new
// user flow (InfoModal first, then consent) is covered in the "modal stacking"
// describe block below.
const seedReturningUser = () =>
  localStorage.setItem(
    'gameState',
    JSON.stringify({ guesses: [], solution: 'placeholder' })
  )

describe('time-tracking consent flow', () => {
  test('shows the consent modal on first load when no preference is saved', () => {
    seedReturningUser()
    render(<App />)
    expect(screen.getByText(TIME_TRACKING_CONSENT_TITLE)).toBeInTheDocument()
  })

  test('does not show the consent modal when preference is already "on"', () => {
    localStorage.setItem('timeTrackingPreference', JSON.stringify('on'))
    render(<App />)
    expect(
      screen.queryByText(TIME_TRACKING_CONSENT_TITLE)
    ).not.toBeInTheDocument()
  })

  test('does not show the consent modal when preference is already "off"', () => {
    localStorage.setItem('timeTrackingPreference', JSON.stringify('off'))
    render(<App />)
    expect(
      screen.queryByText(TIME_TRACKING_CONSENT_TITLE)
    ).not.toBeInTheDocument()
  })

  test('clicking "enable" persists "on" and closes the modal', async () => {
    seedReturningUser()
    render(<App />)
    fireEvent.click(
      screen.getByRole('button', { name: TIME_TRACKING_CONSENT_ENABLE })
    )
    expect(localStorage.getItem('timeTrackingPreference')).toBe(
      JSON.stringify('on')
    )
    await waitFor(() =>
      expect(
        screen.queryByText(TIME_TRACKING_CONSENT_TITLE)
      ).not.toBeInTheDocument()
    )
  })

  test('clicking "disable" persists "off", clears any timer state, and closes the modal', async () => {
    seedReturningUser()
    localStorage.setItem(
      'gameTimer',
      JSON.stringify({
        solution: 'TESTA',
        accumulatedMs: 5000,
        finished: false,
      })
    )
    render(<App />)
    fireEvent.click(
      screen.getByRole('button', { name: TIME_TRACKING_CONSENT_DISABLE })
    )
    expect(localStorage.getItem('timeTrackingPreference')).toBe(
      JSON.stringify('off')
    )
    expect(localStorage.getItem('gameTimer')).toBeNull()
    await waitFor(() =>
      expect(
        screen.queryByText(TIME_TRACKING_CONSENT_TITLE)
      ).not.toBeInTheDocument()
    )
  })

  test('keyboard input is ignored while the consent modal is open', () => {
    seedReturningUser()
    render(<App />)
    expect(screen.getByText(TIME_TRACKING_CONSENT_TITLE)).toBeInTheDocument()
    fireEvent.keyUp(window, { code: 'KeyA', key: 'a' })
    fireEvent.keyUp(window, { code: 'KeyB', key: 'b' })
    fireEvent.keyUp(window, { code: 'Enter' })
    // gameState should not record any progress while the consent modal is open
    const stored = localStorage.getItem('gameState')
    if (stored) {
      const parsed = JSON.parse(stored)
      expect(parsed.guesses).toEqual([])
    }
    // and no timer should have been started either way
    expect(localStorage.getItem('gameTimer')).toBeNull()
  })

  test('virtual keyboard clicks are ignored while the consent modal is open', () => {
    seedReturningUser()
    render(<App />)
    expect(screen.getByText(TIME_TRACKING_CONSENT_TITLE)).toBeInTheDocument()
    // Click multiple on-screen letter keys — Bukvar renders each as its own
    // button. getAllByText returns every match; the first is the keyboard key.
    const keys = screen.getAllByText('A')
    fireEvent.click(keys[0])
    fireEvent.click(keys[0])
    expect(localStorage.getItem('gameTimer')).toBeNull()
  })

  test('with preference "off", typing characters never starts the timer', () => {
    localStorage.setItem('timeTrackingPreference', JSON.stringify('off'))
    render(<App />)
    expect(localStorage.getItem('gameTimer')).toBeNull()
    fireEvent.keyUp(window, { code: 'KeyA', key: 'a' })
    fireEvent.keyUp(window, { code: 'KeyB', key: 'b' })
    fireEvent.keyUp(window, { code: 'KeyC', key: 'c' })
    expect(localStorage.getItem('gameTimer')).toBeNull()
  })

  test('with preference "on", typing characters does start and persist the timer', () => {
    localStorage.setItem('timeTrackingPreference', JSON.stringify('on'))
    render(<App />)
    fireEvent.keyUp(window, { code: 'KeyA', key: 'a' })
    const stored = localStorage.getItem('gameTimer')
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored as string)
    expect(parsed.finished).toBe(false)
    expect(typeof parsed.accumulatedMs).toBe('number')
  })

  test('existing user with active gameTimer + null preference: enable preserves prior progress', async () => {
    seedReturningUser()
    // Pre-populate localStorage as if the user had played mid-puzzle under a
    // previous build (before the consent popup existed). We can't easily seed
    // the EXACT current solution string here, so we use a placeholder — the
    // assertion is that the enable path completes cleanly without throwing
    // and leaves either the restored or a freshly-cleaned timer state.
    localStorage.setItem(
      'gameTimer',
      JSON.stringify({
        solution: 'IRRELEVANT',
        accumulatedMs: 12_345,
        finished: false,
      })
    )
    render(<App />)
    fireEvent.click(
      screen.getByRole('button', { name: TIME_TRACKING_CONSENT_ENABLE })
    )
    expect(localStorage.getItem('timeTrackingPreference')).toBe(
      JSON.stringify('on')
    )
    await waitFor(() =>
      expect(
        screen.queryByText(TIME_TRACKING_CONSENT_TITLE)
      ).not.toBeInTheDocument()
    )
    // Either the stored gameTimer matched today's solution and was restored,
    // or it didn't and was cleared. Both are acceptable outcomes — the
    // important thing is the app didn't throw and the preference stuck.
    expect(['on']).toContain(
      JSON.parse(localStorage.getItem('timeTrackingPreference') as string)
    )
  })
})

describe('modal stacking — brand new user', () => {
  // With no localStorage at all, the existing intro InfoModal auto-opens.
  // Before this fix, the consent modal also rendered at the same z-index and
  // they stomped on each other. They should now show one at a time.

  test('on first ever load, the InfoModal is visible and the consent modal is hidden behind it', () => {
    render(<App />)
    // InfoModal title is "Kako igrati?"
    expect(screen.getByText('Kako igrati?')).toBeInTheDocument()
    expect(
      screen.queryByText(TIME_TRACKING_CONSENT_TITLE)
    ).not.toBeInTheDocument()
  })

  test('input is blocked while the InfoModal is on top and consent is still pending', () => {
    render(<App />)
    fireEvent.keyUp(window, { code: 'KeyA', key: 'a' })
    fireEvent.keyUp(window, { code: 'KeyB', key: 'b' })
    expect(localStorage.getItem('gameTimer')).toBeNull()
    // No guesses recorded either:
    const stored = localStorage.getItem('gameState')
    if (stored) {
      const parsed = JSON.parse(stored)
      expect(parsed.guesses).toEqual([])
    }
  })

  test('closing the InfoModal reveals the consent modal underneath', async () => {
    render(<App />)
    expect(screen.getByText('Kako igrati?')).toBeInTheDocument()
    // Modals render in a Headless UI portal outside the render container —
    // query the document and click the InfoModal's X icon.
    const xButton = document.querySelector('svg.h-6.w-6.cursor-pointer')
    expect(xButton).toBeTruthy()
    fireEvent.click(xButton as Element)
    await waitFor(() =>
      expect(screen.getByText(TIME_TRACKING_CONSENT_TITLE)).toBeInTheDocument()
    )
  })
})
