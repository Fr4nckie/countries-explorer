import { createBrowserRouter } from "react-router-dom";
import Root from "../page/Root.jsx";
import Countries from "../page/Countries.jsx";
import CountryDetail from "../components/CountryDetail.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children: [
            {
                index: true,
                Component: Countries
            },
            {
                path: "/country/:code",
                Component: CountryDetail
            }
        ]
    }
])