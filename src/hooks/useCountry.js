import { useQuery } from "@tanstack/react-query";
import { getCountry } from "../service/getCountry.js";
import { useParams } from "react-router-dom";

export function useCountry() {
    const { code } = useParams()
    return useQuery({
        queryKey: ["country", code],
        queryFn: async () => await getCountry(code)
    })
}