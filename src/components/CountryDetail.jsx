import { Link } from 'react-router-dom'
import { useCountry } from '../hooks/useCountry.js'
import LoadingOverlay from './LoadingOverlay.jsx'
import ErrorComponent from './ErrorComponent'
import BorderCountries from './BorderCountries.jsx'
import { useEffect } from 'react'

function CountryDetail() {
    const { data: country, isError, isLoading, error } = useCountry()

    useEffect(() => {
        const prevFavicon = document.querySelector("link[rel~='icon']")
        const defaultFavicon = prevFavicon?.href

        if (country) {
            document.title = country.name.common
            prevFavicon.href = `${country.flags.svg}`
        }

        return () => {
            document.title = 'Countries Explorer'
            if (prevFavicon && defaultFavicon) {
                prevFavicon.href = defaultFavicon
            }
        }
    }, [country])

    useEffect(() => console.log(country), [country])
 
    if (isLoading) return <LoadingOverlay />
    if (isError) return <ErrorComponent error={error} />

    return (
        <div className="w-full container mx-auto my-6">
            <Link to="/" className="btn">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                    />
                </svg>
                Back
            </Link>
            <div className="my-8 flex flex-col lg:flex-row lg:gap-12">
                <picture>
                    <img
                        src={country.flags.png}
                        alt={country.flags.alt}
                        className="w-full h-fit mb-8 lg:w-2xl lg:mb-0 shadow border border-gray-300 rounded dark:border-none"
                    />
                </picture>
                <div className="w-full">
                    <h2 className="text-2xl font-bold py-3 lg:pt-0">
                        {country.name.common}
                    </h2>
                    <div className="flex flex-col md:flex-row justify-between lg:pe-3">
                        <div className="pb-12">
                            <p>
                                Native Name:{' '}
                                <span className="opacity-50">
                                    {country.altSpellings[2]}
                                </span>
                            </p>
                            <p>
                                Population:{' '}
                                <span className="opacity-50">
                                    {country.population.toLocaleString('en-US')}
                                </span>
                            </p>
                            <p>
                                Region:{' '}
                                <span className="opacity-50">
                                    {country.region}
                                </span>
                            </p>
                            <p>
                                Sub Region:{' '}
                                <span className="opacity-50">
                                    {country.subregion}
                                </span>
                            </p>
                            <p>
                                Capital:{' '}
                                <span className="opacity-50">
                                    {country.capital}
                                </span>
                            </p>
                        </div>
                        <div className="pb-12 flex flex-col gap-1">
                            <p>
                                Top Level domain:{' '}
                                <span className="opacity-50">
                                    {country.tld}
                                </span>
                            </p>
                            <p>
                                Currencies:{' '}
                                <span className="opacity-50">
                                    {Object.keys(country.currencies).map(
                                        (key) => country.currencies[key].name
                                    )}
                                </span>
                            </p>
                            <p>
                                Languages:{' '}
                                <span className="opacity-50">
                                    {Object.values(country.languages).join(
                                        ', '
                                    )}
                                </span>
                            </p>
                        </div>
                    </div>
                    {country.borders && (
                        <BorderCountries codes={country?.borders} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default CountryDetail
