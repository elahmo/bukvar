import { render, screen } from '@testing-library/react'
import { FootballOverlay, FootballPitchBackground } from './FootballOverlay'

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

describe('FootballPitchBackground', () => {
  test('renders a decorative pitch SVG in light mode', () => {
    const { container } = render(<FootballPitchBackground isDarkMode={false} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  test('renders a decorative pitch SVG in dark mode', () => {
    const { container } = render(<FootballPitchBackground isDarkMode={true} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
