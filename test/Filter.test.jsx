import { describe, expect, it } from 'vitest'
import { renderWithProviders } from './renderWithProviders'
import Filter from '../src/components/Filter.jsx'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

describe('<Filter>', () => {
    it('Should render with the default value and text', () => {
        renderWithProviders(<Filter />)
        const defaultOption = screen.getByRole('option', {
            name: /Filter by Region/i
        })
        expect(defaultOption).toBeInTheDocument()
        expect(defaultOption).toBeDisabled()
        expect(screen.getByRole('combobox')).toHaveValue('all')
    })

    it('should change filter value and text when a region is selected', async () => {
        const user = userEvent.setup()
        renderWithProviders(<Filter />)

        const selectElement = screen.getByRole('combobox')

        await user.selectOptions(selectElement, 'Europe')
        expect(selectElement).toHaveValue('Europe')
        expect(screen.getByText('All')).toBeInTheDocument()
    })

    it('should reset filter', async () => {
        const user = userEvent.setup()
        renderWithProviders(<Filter />)

        const selectElement = screen.getByRole('combobox')

        await user.selectOptions(selectElement, 'Africa')
        expect(selectElement).toHaveValue('Africa')
        expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument()

        await user.selectOptions(
            selectElement,
            screen.getByRole('option', { name: 'All' })
        )
        expect(selectElement).toHaveValue('all')
        const defaultOption = screen.getByRole('option', {
            name: /Filter by Region/i
        })
        expect(defaultOption).toBeInTheDocument()
        expect(defaultOption).toBeDisabled()
    })
})
