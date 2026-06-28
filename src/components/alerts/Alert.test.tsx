import { render } from '@testing-library/react'
import { Alert } from './Alert'

test('renders every line of a multi-line message with a <br />', () => {
  const { container } = render(
    <Alert isOpen message={'Prva linija\nDruga linija'} variant="success" />
  )
  expect(container.textContent).toContain('Prva linija')
  expect(container.textContent).toContain('Druga linija')
  expect(container.querySelector('br')).not.toBeNull()
})

test('renders a single-line message without a <br />', () => {
  const { container } = render(<Alert isOpen message="Samo jedna linija" />)
  expect(container.textContent).toContain('Samo jedna linija')
  expect(container.querySelector('br')).toBeNull()
})
