import { api } from "./api.js"

export const getCountry = async (code) => {
    const response = await api.get(`/alpha/${code}`)
    if (!response.data || response.data.length === 0) {
        throw new Error('Aucune donnée de pays trouvée.')
    }

    return response.data[0]
}