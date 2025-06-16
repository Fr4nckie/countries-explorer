import { useCountryFilter } from '../hooks/useCountryFilter.jsx'

function Filter() {
    const { filter, setFilter } = useCountryFilter()

    const handleFilterChange = (e) => {
        setFilter(e.target.value)
    }

    return (
        <select
            className="select bg-base-200 border-none shadow-md h-12 w-64 lg:w-48 cursor-pointer"
            onChange={handleFilterChange}
            value={filter}
        >
            <option disabled={filter === 'all'} value="all">
                {filter == 'all' ? 'Filter by Region' : 'All'}
            </option>
            <option>Africa</option>
            <option>Americas</option>
            <option>Asia</option>
            <option>Europe</option>
            <option>Oceania</option>
        </select>
    )
}

export default Filter
