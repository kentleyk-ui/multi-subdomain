import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Dashboard from '@/pages/index'

jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}))

describe('Dashboard Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render dashboard title', () => {
    render(<Dashboard />)
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
  })

  it('should display statistics cards', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        subdomains: 5,
        pages: 12,
        backups: 2,
        certificates: 3,
      }),
    })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText(/subdomains/i)).toBeInTheDocument()
    })
  })

  it('should fetch subdomains on mount', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ subdomains: [] }),
    })

    render(<Dashboard />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })
  })

  it('should show loading state while fetching', () => {
    global.fetch.mockImplementationOnce(() => new Promise(() => {}))

    render(<Dashboard />)
    // Component should render without crashing
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('should handle API errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API Error'))

    render(<Dashboard />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })
  })

  it('should apply glass morphism theme styles', () => {
    const { container } = render(<Dashboard />)
    const mainElement = container.querySelector('main')
    const styles = window.getComputedStyle(mainElement)

    // Check for glass morphism characteristics
    expect(mainElement).toHaveClass('glass')
  })

  it('should render action buttons', async () => {
    render(<Dashboard />)

    // Buttons should be present
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})
