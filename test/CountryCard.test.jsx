import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from './renderWithProviders.jsx'
import CountryCard from '../src/components/CountryCard.jsx'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import CountryDetail from '../src/components/CountryDetail.jsx'
import { cleanup } from '@testing-library/react'
import { mockCountry } from './mockCountry.js'

vi.mock('../src/hooks/useCountry.js', () => ({
    useCountry: () => ({
        data: mockCountry,
        isLoading: false,
        isError: false,
        error: null
    })
}))

describe('<CountryCard>', () => {
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

    it('should render correctly', () => {
        const { container } = renderWithProviders(
            <CountryCard country={mockCountry} />
        )

        // Le snapshot est correct, pas besoin de le changer.
        expect(container.firstChild).toMatchInlineSnapshot(`
        <div
          class="card bg-base-200 shadow-md w-76 h-full md:w-full"
        >
          <figure>
            <img
              class="w-full h-38 cursor-pointer"
              src="https://flagcdn.com/w320/de.png"
            />
          </figure>
          <div
            class="card-body flex-none basis-auto justify-self-end"
          >
            <h2
              class="card-title cursor-pointer hover:underline"
            >
              Germany
            </h2>
            <p
              class="flex items-center gap-1"
            >
              <span>
                Population:
              </span>
              <span
                class="opacity-50"
              >
                83,240,525
              </span>
            </p>
            <p
              class="flex items-center gap-1"
            >
              <span>
                Region:
              </span>
              <span
                class="opacity-50"
              >
                Europe
              </span>
            </p>
            <p
              class="flex items-center gap-1"
            >
              <span>
                Capital:
              </span>
              <span
                class="opacity-50"
              >
                Berlin
              </span>
            </p>
          </div>
        </div>
      `)
    })

    it('should navigate to the country detail page when clicked', async () => {
        const user = userEvent.setup()
        renderWithProviders(
            <Routes>
                <Route
                    path="/"
                    element={<CountryCard country={mockCountry} />}
                />
                <Route path="/country/:code" element={<CountryDetail />} />
            </Routes>
        )

        await user.click(screen.getByText('Germany'))

        // Ces assertions sont excellentes pour vérifier la navigation.
        expect(
            await screen.findByRole('link', { name: /Back/i })
        ).toBeInTheDocument()
        expect(document.title).toBe('Germany')

        await user.click(screen.getByRole('link', { name: /Back/i }))
        expect(document.title).toBe('Countries Explorer')
    })
})
