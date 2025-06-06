import { useNavigate } from 'react-router-dom'

function CountryCard({ country }) {
    const navigate = useNavigate()
    const handleClick = () => {
        navigate(`/country/${country.cca2}`)
    }

    return (
        <div className="card bg-base-200 shadow-md w-76 h-full md:w-full">
            <figure>
                <img
                    src={country.flags.png}
                    alt={country.flags.alt}
                    className="w-full h-38 cursor-pointer"
                    onClick={handleClick}
                />
            </figure>
            <div className="card-body flex-none basis-auto justify-self-end">
                <h2
                    className="card-title cursor-pointer hover:underline"
                    onClick={handleClick}
                >
                    {country.name.common}
                </h2>
                <p className="flex items-center gap-1">
                    <span>Population:</span>
                    <span className="opacity-50">
                        {country.population.toLocaleString('en-US')}
                    </span>
                </p>
                <p className="flex items-center gap-1">
                    <span>Region:</span>
                    <span className="opacity-50">{country.region}</span>
                </p>
                <p className="flex items-center gap-1">
                    <span>Capital:</span>
                    <span className="opacity-50">{country.capital}</span>
                </p>
            </div>
        </div>
    )
}

export default CountryCard
