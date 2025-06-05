export const sortByName = (array) => {
    return [...array].sort((a, b) => {
        if (a.name.common < b.name.common) {
            return -1
        }
        if (a.name.common > b.name.common) {
            return 1
        }
        return 0
    })
}

export const matchesRegion = (country, region) => {
    return !region || country.region == region
}

export const matchesSearch = (country, searchTerm) => {
    const countryName = country.name.common.toLowerCase()
    return countryName.includes(searchTerm)
}

export const getSearchPriority = (countryName, searchTerm) => {
    return countryName.startsWith(searchTerm) ? 0 : 1
}