import { useCallback, useEffect } from 'react'
import { useCountryFilter } from '../hooks/useCountryFilter.jsx'
import { debounce } from 'lodash'

function Searchbar() {
    const { searchTerm, setSearchTerm, setFilter } = useCountryFilter()
    const debouncedSearch = useCallback(
        debounce((value) => {
            setSearchTerm(value)
            if (value !== '') setFilter('all')
        }, 300),
        []
    )

    const handleChange = (e) => {
        debouncedSearch(e.target.value)
    }

    return (
        <label className="input w-full h-12 px-8 bg-base-200 border-none shadow-none lg:w-96">
            <svg
                className="h-[1em] text-base-content"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </g>
            </svg>
            <input
                type="search"
                className="grow text-base-content placeholder:text-base-content px-8"
                placeholder="Search for a country..."
                value={searchTerm}
                onChange={handleChange}
            />
        </label>
    )
}

export default Searchbar
