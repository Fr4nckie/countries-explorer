import { useQuery } from "@tanstack/react-query";
import { getNeighbours } from "../service/getNeighbours.js";

export function useNeighbours(codes) {
    return useQuery({
        queryKey: ["neighbours", codes],
        queryFn: async () => await getNeighbours(codes)
    })
}