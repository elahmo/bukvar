import { render, screen } from '@testing-library/react'
import {
  FootballOverlay,
  FootballPitchBackground,
  buildPitchStyle,
} from './FootballOverlay'

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

describe('FootballOverlay (kickable ball)', () => {
  test('renders the draggable football when motion is allowed', () => {
    mockMatchMedia(false)
    render(<FootballOverlay />)
    const ball = screen.getByTestId('football')
    expect(ball).toBeInTheDocument()
    expect(ball).toHaveTextContent('⚽')
  })

  test('renders nothing when the user prefers reduced motion', () => {
    mockMatchMedia(true)
    render(<FootballOverlay />)
    expect(screen.queryByTestId('football')).not.toBeInTheDocument()
  })
})

describe('buildPitchStyle', () => {
  test('layers an SVG pitch over grass stripes', () => {
    const style = buildPitchStyle(false)
    expect(style.backgroundImage).toContain('data:image/svg+xml')
    expect(style.backgroundImage).toContain('svg')
    expect(style.backgroundImage).toContain('repeating-linear-gradient')
  })

  test('uses white markings in dark mode and pitch-green in light mode', () => {
    // rgba() commas are percent-encoded (%2C) inside the data URI.
    expect(buildPitchStyle(true).backgroundImage).toContain('255%2C255%2C255')
    expect(buildPitchStyle(false).backgroundImage).toContain('20%2C83%2C45')
  })
})

describe('FootballPitchBackground', () => {
  // The pitch is painted onto document.body (the page "canvas") rather than a
  // fixed overlay, which avoids an iOS Safari stale-paint band near the bottom
  // toolbar. The component therefore renders no DOM of its own.
  test('renders no DOM of its own', () => {
    const { container } = render(<FootballPitchBackground isDarkMode={false} />)
    expect(container).toBeEmptyDOMElement()
  })
})
