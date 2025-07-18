import { RouterProvider } from 'react-router-dom'
import { router } from './app/router.js'

function App() {
    return <RouterProvider router={router} />
}

export default App
