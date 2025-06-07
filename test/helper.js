import { render } from "@testing-library/react"
import { FilterProvider } from '../src/hooks/useCountryFilter';

export const renderWithProviders = (ui, options) => {
    return render(ui, { wrapper: FilterProvider, ...options })
}