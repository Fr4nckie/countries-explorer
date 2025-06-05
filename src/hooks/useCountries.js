import { useQuery } from "@tanstack/react-query";
import { getAllCountries } from "../service/getAllCountries.js";
import { useMemo } from "react";
import { getSearchPriority, matchesRegion, matchesSearch, sortByName } from "../utils/helper.js";
import { useCountryFilter } from "./useCountryFilter.jsx";

export function useCountries() {
    const { data, isError, isLoading, error } = useQuery({
        queryKey: ["all-countries"],
        queryFn: getAllCountries,
        staleTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false
    })

    const { filter, searchTerm } = useCountryFilter()

    const countries = useMemo(() => {
        if (!data || isError) return []
        let result = sortByName(data)

        if (filter !== 'all') {
            result = result.filter(country => matchesRegion(country, filter))
        }

        if (searchTerm) {
            result = result.filter(country => matchesSearch(country, searchTerm)).sort((a, b) => {
                const aPriority = getSearchPriority(a.name.common.toLowerCase(), searchTerm)
                const bPriority = getSearchPriority(b.name.common.toLowerCase(), searchTerm)
                return aPriority - bPriority
            })
        }

        return result

    }, [data, filter, isError, searchTerm])

    return { countries, error, isError, isLoading }
}