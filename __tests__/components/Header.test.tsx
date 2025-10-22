import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'

// Mock ThemeContext
jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
  }),
}))

describe('Header Component', () => {
  it('renders navigation links', () => {
    render(<Header />)
    
    expect(screen.getByText('Anasayfa')).toBeInTheDocument()
    expect(screen.getByText('Hizmetler')).toBeInTheDocument()
    expect(screen.getByText('Projeler')).toBeInTheDocument()
    expect(screen.getByText('Okan Demir Kimdir?')).toBeInTheDocument()
    expect(screen.getByText('İletişim')).toBeInTheDocument()
  })

  it('renders logo', () => {
    render(<Header />)
    
    const logo = screen.getByAltText(/Okan Demir/i)
    expect(logo).toBeInTheDocument()
  })

  it('has correct navigation structure', () => {
    render(<Header />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })
})

