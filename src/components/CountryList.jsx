import { useCallback, useEffect, useRef, useState } from 'react'
import CountryCard from './CountryCard'
import { useCountries } from '../hooks/useCountries.js'
import LoadingOverlay from './LoadingOverlay.jsx'
import ErrorComponent from './ErrorComponent.jsx'
import Loading from './Loading.jsx'

function CountryList() {
    const [visibleCount, setVisibleCount] = useState(10)
    const { countries, isError, isLoading, error } = useCountries()
    const loaderRef = useRef(null)
    const observerRef = useRef(null)

    const loadMore = useCallback(() => {
        // if (!countries || countries.length === 0) return
        setVisibleCount((prev) => Math.min(prev + 10, countries.length))
    }, [countries])

    useEffect(() => {
        if (!countries || countries.length === 0 || isLoading) return

        if (observerRef.current) {
            observerRef.current.disconnect()
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]

                if (
                    entry.isIntersecting &&
                    entry.intersectionRatio === 1 &&
                    visibleCount < countries.length
                ) {
                    loadMore()
                }
            },
            {
                root: null,
                threshold: [0.1, 0.5, 1.0]
            }
        )

        if (loaderRef.current) {
            observerRef.current.observe(loaderRef.current)
        }

        return () => {
            if (loaderRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [countries, visibleCount, isLoading, loadMore])

    useEffect(() => {
        if (countries && countries.length > 0) {
            setVisibleCount(10)
        }
    }, [countries])

    if (isLoading) return <LoadingOverlay />
    if (isError)
        return (
            <div className="container mx-auto">
                <ErrorComponent error={error} />
            </div>
        )

    const hasMoreToLoad = countries.length > visibleCount
    const displayedCountries = countries.slice(0, visibleCount)

    return (
        <>
            <ul className="container grid gap-12 justify-center md:grid-cols-3 lg:grid-cols-4 my-8">
                {displayedCountries.map((country) => (
                    <li key={country.name.common} className="h-full">
                        <CountryCard country={country} />
                    </li>
                ))}
            </ul>

            {hasMoreToLoad && (
                <div
                    role="status"
                    ref={loaderRef}
                    className="w-full h-12 flex items-center justify-center"
                >
                    <Loading />
                </div>
            )}

            {!hasMoreToLoad && countries.length > 0 && (
                <div className="text-center mt-8 mb-8">
                    All {countries.length}{' '}
                    {countries.length > 1 ? 'countries' : 'country'} loaded.
                </div>
            )}

            {countries.length === 0 && !isLoading && (
                <div className="text-center mt-8">No results found.</div>
            )}
        </>
    )
}

export default CountryList
