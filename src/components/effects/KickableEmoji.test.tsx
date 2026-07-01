import { render, screen } from '@testing-library/react'
import { KickableEmoji } from './KickableEmoji'

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

describe('KickableEmoji', () => {
  test('renders the given emoji when motion is allowed', () => {
    mockMatchMedia(false)
    render(<KickableEmoji emoji="🎂" testId="birthday-cake" />)
    const toy = screen.getByTestId('birthday-cake')
    expect(toy).toBeInTheDocument()
    expect(toy).toHaveTextContent('🎂')
  })

  test('renders nothing when the user prefers reduced motion', () => {
    mockMatchMedia(true)
    render(<KickableEmoji emoji="🎂" testId="birthday-cake" />)
    expect(screen.queryByTestId('birthday-cake')).not.toBeInTheDocument()
  })
})
