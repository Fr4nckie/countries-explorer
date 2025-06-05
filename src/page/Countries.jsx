import CountryList from '../components/CountryList.jsx'
import Filter from '../components/Filter.jsx'
import Searchbar from '../components/Searchbar.jsx'

function Countries() {
    return (
        <>
            <div className="container flex flex-col my-6 gap-8 md:items-center md:flex-row md:justify-between">
                <Searchbar />
                <Filter />
            </div>
            <CountryList />
        </>
    )
}

export default Countries
