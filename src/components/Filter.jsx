import { useCountryFilter } from '../hooks/useCountryFilter.jsx'

function Filter() {
    const { filter, setFilter } = useCountryFilter()

    const handleFilterChange = (e) => {
        const filter = e.target.value
        setFilter((prev) => (filter == prev ? 'all' : filter))
    }

    return (
        <select
            className="select bg-base-200 border-none shadow-none h-12 w-64 lg:w-48"
            onChange={handleFilterChange}
            defaultValue="all"
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
