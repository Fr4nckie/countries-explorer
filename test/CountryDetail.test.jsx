import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockCountry } from './mockCountry.js'
import { cleanup, screen } from '@testing-library/react'
import { renderWithProviders } from './renderWithProviders'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import CountryDetail from '../src/components/CountryDetail.jsx'

const mockSuccessUseCountry = {
    data: mockCountry,
    isLoading: false,
    isError: false,
    error: null
}

const mockSuccessUseNeighbours = {
    isLoading: false,
    isError: false,
    error: null,
    data: [
        {
            name: {
                common: 'Germany',
                official: 'Federal Republic of Germany'
            },
            cca2: 'DE'
        },
        {
            name: {
                common: 'France',
                official: 'French Republic'
            },
            cca2: 'FR'
        }
    ]
}

vi.mock('../src/hooks/useCountry.js')
vi.mock('../src/hooks/useNeighbours.js')

import { useCountry } from '../src/hooks/useCountry.js'
import { useNeighbours } from '../src/hooks/useNeighbours.js'

describe('<CountryDetail>', () => {
    let favicon

    beforeEach(() => {
        vi.clearAllMocks()

        favicon = document.createElement('link')
        favicon.rel = 'icon'
        favicon.ref = 'default-favicon.ico'

        document.head.appendChild(favicon)
    })

    afterEach(() => {
        document.head.removeChild(favicon)
        cleanup()
    })

    describe('when data fetching is successful', () => {
        beforeEach(() => {
            useCountry.mockReturnValue(mockSuccessUseCountry)
            useNeighbours.mockReturnValue(mockSuccessUseNeighbours)
        })

        it('should render correctly', () => {
            renderWithProviders(<CountryDetail />)
            expect(
                screen.getByRole('button', { name: /Germany/i })
            ).toBeInTheDocument()
            expect(screen.getByText('Border Countries:')).toBeInTheDocument()
        })

        it('should navigate to neighbour country', async () => {
            renderWithProviders(
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <h1>Home</h1> <CountryDetail />
                            </>
                        }
                    />
                    <Route path="/country/:code" element={<CountryDetail />} />
                </Routes>
            )

            const btn = screen.getByRole('button', { name: /Germany/i })
            expect(btn).toBeInTheDocument()

            await userEvent.click(btn)
            expect(document.title).toBe('Germany')
            expect(
                screen.getByRole('link', { name: /Back/i })
            ).toBeInTheDocument()
        })
    })

    describe('when loading', () => {
        it('should render the loading state', () => {
            useCountry.mockReturnValue({
                isLoading: true,
                isError: false,
                error: null,
                data: null
            })

            renderWithProviders(<CountryDetail />)
            expect(screen.getByRole('status')).toBeInTheDocument()
            expect(screen.getByTestId('loading-testid')).toBeInTheDocument()
        })
    })

    describe('when there is an error fetching country', () => {
        it('should render the error state', () => {
            const errorMessage = 'Failed to fetch country details'
            useCountry.mockReturnValue({
                isLoading: false,
                isError: true,
                data: null,
                error: { message: errorMessage }
            })

            renderWithProviders(<CountryDetail />)

            expect(screen.getByRole('alert'))
            expect(screen.getByTestId('error-testid')).toBeInTheDocument()
            expect(
                screen.getByText(new RegExp(errorMessage, 'i'))
            ).toBeInTheDocument()
        })
    })

    describe('when there is an error fetching neighbours', () => {
        it('should render country details but show an error for neighbours', () => {
            const errorMessage = 'Failed to fetch neighbours'
            useCountry.mockReturnValue(mockSuccessUseCountry)
            useNeighbours.mockReturnValue({
                isLoading: false,
                isError: true,
                data: null,
                error: { message: errorMessage }
            })

            renderWithProviders(<CountryDetail />)

            expect(
                screen.getByRole('link', { name: /Back/i })
            ).toBeInTheDocument()
            expect(
                screen.getByText(mockCountry.name.common)
            ).toBeInTheDocument()

            expect(screen.getByRole('alert'))
            expect(
                screen.getByText(new RegExp(errorMessage, 'i'))
            ).toBeInTheDocument()
        })
    })

    describe('when neighbours are loading', () => {
        it('should display a loading indicator for neighbours', () => {
            useCountry.mockReturnValue(mockSuccessUseCountry)
            useNeighbours.mockReturnValue({
                isLoading: true,
                isError: true,
                data: null,
                error: null
            })

            renderWithProviders(<CountryDetail />)

            expect(
                screen.getByRole('link', { name: /Back/i })
            ).toBeInTheDocument()
            expect(
                screen.getByText(mockCountry.name.common)
            ).toBeInTheDocument()

            expect(screen.getByRole('status')).toBeInTheDocument()
            expect(screen.getByTestId('loading-testid')).toBeInTheDocument()
        })
    })
})
