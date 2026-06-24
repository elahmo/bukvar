import { render, screen } from '@testing-library/react'
import { ConfettiCannons } from './ConfettiCannons'

const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

// The 2d canvas context is stubbed to null globally in setupTests.ts, so these
// tests exercise the graceful no-context path.
describe('ConfettiCannons (Bosna victory)', () => {
  test('renders the confetti canvas when motion is allowed', () => {
    mockMatchMedia(false)
    render(<ConfettiCannons fire={0} />)
    expect(screen.getByTestId('confetti-cannons')).toBeInTheDocument()
  })

  test('renders nothing when the user prefers reduced motion', () => {
    mockMatchMedia(true)
    render(<ConfettiCannons fire={1} />)
    expect(screen.queryByTestId('confetti-cannons')).not.toBeInTheDocument()
  })

  test('firing a volley does not throw without a 2d canvas context', () => {
    mockMatchMedia(false)
    const { rerender } = render(<ConfettiCannons fire={0} />)
    expect(() => rerender(<ConfettiCannons fire={1} />)).not.toThrow()
  })
})
