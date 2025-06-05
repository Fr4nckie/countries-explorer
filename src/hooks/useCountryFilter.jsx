import { createContext, useContext, useMemo, useState } from 'react'

const FilterContext = createContext()

export const FilterProvider = ({ children }) => {
    const [filter, setFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    const value = useMemo(
        () => ({
            searchTerm,
            setSearchTerm,
            filter,
            setFilter
        }),
        [filter, searchTerm]
    )

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    )
}

export const useCountryFilter = () => {
    return useContext(FilterContext)
}
