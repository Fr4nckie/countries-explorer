import { createPortal } from 'react-dom'
import Loading from './Loading.jsx'

function LoadingOverlay() {
    return createPortal(
        <div className="absolute top-3 left-2/4 bg-base-100 p-2 rounded-lg shadow-md z-100">
            <Loading />
        </div>,
        document.body
    )
}

export default LoadingOverlay
