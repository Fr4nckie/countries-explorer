import { describe, expect, it } from 'vitest'
import Header from '../src/components/Header.jsx'
import { renderWithProviders } from './helper.js'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/dom'

describe('<Header>', () => {
    it('should render correctly', () => {
        const { container } = renderWithProviders(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        )

        expect(container.firstChild).toMatchInlineSnapshot(`
          <div
            class="bg-base-200 sticky top-0 z-50 shadow-sm"
          >
            <div
              class="container h-16 flex items-center justify-between"
            >
              <a
                class="font-bold text-xl"
                data-discover="true"
                href="/"
              >
                Where in the world?
              </a>
              <button
                class="btn shadow-none border-none"
              >
                <svg
                  class="size-6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                 
                Light mode
              </button>
            </div>
          </div>
        `)
    })

    it('should toggle theme correctly', async () => {
        const user = userEvent.setup()

        document.documentElement.removeAttribute('data-theme')
        localStorage.removeItem('theme')

        renderWithProviders(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        )

        expect(document.documentElement.getAttribute('data-theme')).toBe(
            'darkcustom'
        )

        const button = screen.getByRole('button', { name: /light mode/i })
        expect(button).toBeInTheDocument()

        await user.click(button)

        expect(document.documentElement.getAttribute('data-theme')).toBe(
            'lightcustom'
        )
        expect(
            await screen.findByRole('button', { name: /dark mode/i })
        ).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: /dark mode/i }))
        expect(document.documentElement.getAttribute('data-theme')).toBe(
            'darkcustom'
        )
    })
})
