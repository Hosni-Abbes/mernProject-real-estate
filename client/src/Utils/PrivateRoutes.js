import { Outlet, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

function PrivateRoutes() {
    const { user } = useAuth()
    const location = useLocation()

    return (
        user?.user 
            ? <Outlet /> 
            : <Navigate to='/login' state={{from: location}} replace />
    )
}

export default PrivateRoutes