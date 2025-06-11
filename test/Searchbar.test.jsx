import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from './renderWithProviders'
import Searchbar from '../src/components/Searchbar.jsx'
import { fireEvent, screen } from '@testing-library/dom'
import { useCountryFilter } from '../src/hooks/useCountryFilter.jsx'

vi.mock('../src/hooks/useCountryFilter.jsx', async (importOriginal) => {
    const actualModule = await importOriginal()
    return {
        ...actualModule,
        useCountryFilter: vi.fn()
    }
})

describe('<Searchbar>', () => {
    const mockSetSearchTerm = vi.fn()
    const mockSetFilter = vi.fn()

    beforeEach(() => {
        useCountryFilter.mockReturnValue({
            searchTerm: '',
            setSearchTerm: mockSetSearchTerm,
            setFilter: mockSetFilter
        })
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.clearAllMocks()
        vi.useRealTimers()
    })

    it('should render the search field with the correct placeholder', () => {
        renderWithProviders(<Searchbar />)
        const inputElement = screen.getByPlaceholderText(
            'Search for a country...'
        )
        expect(inputElement).toBeInTheDocument()
    })

    it('should update the input value on user input', () => {
        renderWithProviders(<Searchbar />)
        const inputElement = screen.getByPlaceholderText(
            'Search for a country...'
        )

        fireEvent.change(inputElement, { target: { value: 'Germany' } })

        useCountryFilter.mockReturnValue({
            searchTerm: 'Germany',
            setSearchTerm: mockSetSearchTerm,
            setFilter: mockSetFilter
        })

        renderWithProviders(<Searchbar />)
        expect(screen.getByDisplayValue('Germany')).toBeInTheDocument()
    })

    it('should call setSearchTerm and setFilter after the debouce delay', () => {
        renderWithProviders(<Searchbar />)
        const inputElement = screen.getByPlaceholderText(
            'Search for a country...'
        )

        fireEvent.change(inputElement, { target: { value: 'Italy' } })

        expect(mockSetSearchTerm).not.toHaveBeenCalled()
        expect(mockSetFilter).not.toHaveBeenCalled()

        vi.advanceTimersByTime(300)

        expect(mockSetSearchTerm).toHaveBeenCalled('Italy')
        expect(mockSetSearchTerm).toHaveBeenCalledTimes(1)
        expect(mockSetFilter).toHaveBeenCalledTimes(1)
        expect(mockSetFilter).toHaveBeenCalled(1)
    })

    it('should not call setFilter if the field is cleared', () => {
        renderWithProviders(<Searchbar />)

        const inputElement = screen.getByPlaceholderText(
            'Search for a country...'
        )

        fireEvent.change(inputElement, { target: { value: 'Madagascar' } })

        vi.advanceTimersByTime(300)
        vi.clearAllMocks()

        fireEvent.change(inputElement, { target: { value: '' } })
        vi.advanceTimersByTime(300)

        expect(mockSetSearchTerm).not.toHaveBeenCalled()
        expect(mockSetFilter).not.toHaveBeenCalled()
    })
})
