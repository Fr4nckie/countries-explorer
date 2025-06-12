import { api } from "./api.js"

export const getAllCountries = async () => {
    const response = await api.get('/all?fields=name,cca2,capital,region,population,flags,languages,currencies,borders,subregion')
    return response.data
}
