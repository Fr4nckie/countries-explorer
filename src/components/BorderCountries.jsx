import { useNavigate } from 'react-router-dom'
import { useNeighbours } from '../hooks/useNeighbours.js'
import LoadingOverlay from './LoadingOverlay.jsx'
import ErrorComponent from './ErrorComponent.jsx'

function BorderCountries({ codes }) {
    const navigate = useNavigate()
    const { data: countries, isLoading, isError, error } = useNeighbours(codes)

    const handleClick = (code) => {
        navigate(`/country/${code}`)
    }

    if (isLoading) return <LoadingOverlay />
    if (isError) return <ErrorComponent error={error} />

    return (
        <div>
            <p className="pb-4">Border Countries:</p>
            <ul className="flex items-center gap-3 flex-wrap">
                {countries.map((country) => (
                    <li key={country.name.official}>
                        <button
                            className="btn"
                            onClick={() => handleClick(country.cca2)}
                        >
                            {country.name.common}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default BorderCountries
