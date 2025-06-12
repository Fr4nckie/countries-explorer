import { describe, expect, it } from 'vitest'
import { renderWithProviders } from './renderWithProviders'
import Countries from '../src/page/Countries.jsx'
import { screen } from '@testing-library/dom'

describe('<Countries Page>', () => {
    it('should render correctly', () => {
        renderWithProviders(<Countries />)

        expect(
            screen.getByPlaceholderText('Search for a country...')
        ).toBeInTheDocument()

        expect(
            screen.getByRole('option', { name: /Filter by Region/i })
        ).toBeInTheDocument()
    })
})
