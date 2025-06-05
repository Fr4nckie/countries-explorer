import { api } from "./api.js"

export const getAllCountries = async () => {
    const response = await api.get('/all')
    return response.data
}
