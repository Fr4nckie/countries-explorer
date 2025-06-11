import { beforeEach, describe, expect, it, vi } from 'vitest'
import Header from '../src/components/Header.jsx'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/dom'
import { renderWithProviders } from './renderWithProviders.jsx'

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
})

describe('<Header>', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        document.documentElement.removeAttribute('data-theme')
    })

    it('should render correctly', () => {
        localStorageMock.getItem.mockReturnValue(null)

        renderWithProviders(<Header />)

        expect(
            screen.getByRole('link', { name: /Where in the world?/i })
        ).toBeInTheDocument()
    })

    it('should use default theme when no localStorage value', () => {
        localStorageMock.getItem.mockReturnValue(null)
        renderWithProviders(<Header />)

        expect(document.documentElement.getAttribute('data-theme')).toBe(
            'darkcustom'
        )
        expect(localStorageMock.getItem).toHaveBeenCalledWith('theme')
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'theme',
            'darkcustom'
        )
    })

    it('should use saved theme from localStorage', () => {
        localStorageMock.getItem.mockReturnValue('lightcustom')
        renderWithProviders(<Header />)

        expect(document.documentElement.getAttribute('data-theme')).toBe(
            'lightcustom'
        )
        expect(localStorageMock.getItem).toHaveBeenCalledWith('theme')
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'theme',
            'lightcustom'
        )
    })

    it('should toggle theme correctly and save to localStorage', async () => {
        const user = userEvent.setup()
        localStorageMock.getItem.mockReturnValue(null)
        renderWithProviders(<Header />)

        expect(document.documentElement.getAttribute('data-theme')).toBe(
            'darkcustom'
        )
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'theme',
            'darkcustom'
        )

        const button = screen.getByRole('button', { name: /light mode/i })
        expect(button).toBeInTheDocument()

        // Light Mode
        await user.click(button)

        expect(document.documentElement.getAttribute('data-theme')).toBe(
            'lightcustom'
        )
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'theme',
            'lightcustom'
        )
        expect(
            await screen.findByRole('button', { name: /dark mode/i })
        ).toBeInTheDocument()

        // Dark Mode
        await user.click(screen.getByRole('button', { name: /dark mode/i }))
        expect(document.documentElement.getAttribute('data-theme')).toBe(
            'darkcustom'
        )
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'theme',
            'darkcustom'
        )
        expect(
            await screen.findByRole('button', { name: /light mode/i })
        ).toBeInTheDocument()
    })
})
