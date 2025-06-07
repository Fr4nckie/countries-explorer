import { render } from '@testing-library/react'
import { FilterProvider } from '../src/hooks/useCountryFilter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

export const renderWithProviders = (ui, { route = '/' } = {}, options) => {
    const queryClient = new QueryClient()
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </QueryClientProvider>,
        { wrapper: FilterProvider, ...options }
    )
}
