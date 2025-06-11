import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCountries } from '../src/hooks/useCountries.js'
import { renderWithProviders } from './renderWithProviders.jsx'
import CountryList from '../src/components/CountryList.jsx'
import { screen, waitFor } from '@testing-library/dom'
import { act } from 'react'

vi.mock('../src/components/CountryCard.jsx', () => ({
    default: ({ country }) => <div>{country.name.common}</div>
}))
vi.mock('../src/components/Loading.jsx', () => ({
    default: () => <div role="status">Loading...</div>
}))

vi.mock('../src/hooks/useCountries.js')

let mockIntersectionObserverCallbacks = []

beforeEach(() => {
    mockIntersectionObserverCallbacks = []

    vi.stubGlobal(
        'IntersectionObserver',
        vi.fn((cb) => {
            mockIntersectionObserverCallbacks.push(cb)
            return {
                observe: vi.fn(),
                unobserve: vi.fn(),
                disconnect: vi.fn()
            }
        })
    )
})

afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
})

const triggerIntersection = (isIntersecting, intersectionRatio = 1) => {
    act(() => {
        mockIntersectionObserverCallbacks.forEach((cb) => {
            cb([{ isIntersecting, intersectionRatio }])
        })
    })
}

describe('<CountryList>', () => {
    it('should render the loading overlay when isLoading is true', () => {
        useCountries.mockReturnValue({
            countries: null,
            isLoading: true,
            isError: false,
            erro: null
        })

        renderWithProviders(<CountryList />)
        expect(screen.getByTestId('loading-testid')).toBeInTheDocument()
    })

    it('should render the error component when isError is true', () => {
        const errorMessage = 'Failed to fetch'
        useCountries.mockReturnValue({
            isLoading: false,
            isError: true,
            error: { message: errorMessage },
            countries: null
        })

        renderWithProviders(<CountryList />)
        expect(screen.getByRole('alert'))
        expect(screen.getByTestId('error-testid'))
    })

    it('should render a "no results message when data is an empty array"', () => {
        useCountries.mockReturnValue({
            countries: [],
            isLoading: false,
            isError: false,
            error: null
        })

        renderWithProviders(<CountryList />)

        expect(screen.getByText('No results found.')).toBeInTheDocument()
    })

    describe('when data is fetched successfully', () => {
        const mockCountries = Array.from({ length: 25 }, (_, i) => ({
            name: { common: `Country ${i + 1}` },
            cca2: `C${i}`
        }))

        beforeEach(() => {
            useCountries.mockReturnValue({
                countries: mockCountries,
                isLoading: false,
                isError: false,
                error: null
            })
        })

        it('should render the first 10 countries initially', () => {
            renderWithProviders(<CountryList />)

            const listItems = screen.getAllByRole('listitem')
            expect(listItems).toHaveLength(10)
            expect(screen.queryByText('Country 11')).not.toBeInTheDocument()
            expect(screen.getByText('Loading...')).toBeInTheDocument()
        })

        it('should load more countries when loader becomes visible', async () => {
            renderWithProviders(<CountryList />)

            expect(screen.getAllByRole('listitem')).toHaveLength(10)

            triggerIntersection(true)

            await waitFor(() => {
                expect(screen.getAllByRole('listitem')).toHaveLength(20)
                expect(screen.getByText('Country 20')).toBeInTheDocument()
                expect(screen.queryByText('Country 21')).not.toBeInTheDocument()
            })
        })

        it('should display the "All [country.length > 1] countries loaded" message when all countries are visible', () => {
            const shortMockCountries = Array.from({ length: 5 }, (_, i) => ({
                name: { common: `Country ${i + 1}` }
            }))

            useCountries.mockReturnValue({
                countries: shortMockCountries,
                isLoading: false,
                isError: false,
                error: null
            })

            renderWithProviders(<CountryList />)

            expect(screen.getAllByRole('listitem')).toHaveLength(5)
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
            expect(
                screen.getByText(/All 5 countries loaded./i)
            ).toBeInTheDocument()
        })

        it('should display "All [country.length === 1] country loaded" message when all countries are visible', () => {
            const shortMockCountries = [{ name: { common: 'Country 1' } }]
            useCountries.mockReturnValue({
                countries: shortMockCountries,
                isLoading: false,
                isError: false,
                error: null
            })

            renderWithProviders(<CountryList />)

            expect(screen.getAllByRole('listitem')).toHaveLength(1)
            expect(
                screen.getByText(/All 1 country loaded./i)
            ).toBeInTheDocument()
        })
    })
})
