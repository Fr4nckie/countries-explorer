import { api } from "./api.js";

export async function getNeighbours(codes) {
    const response = await api.get(`/alpha?codes=${Object.values(codes).join(",")}`)
    if (!response.data || response.data.length == 0) {
        throw new Error("Aucune donnée trouvée.")
    }
    return response.data
}