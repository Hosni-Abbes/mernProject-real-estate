import { Outlet, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useRefreshToken } from "../hooks/useRefreshToken"
import { useEffect } from "react"

function NotAuthRoutes() {
    const { user } = useAuth()
    const location = useLocation()
    const refresh = useRefreshToken()

    useEffect(()=>{
        let isMounted = true
        const generateToken = async () => {
            try { await refresh()
            }catch(err) { return err }
        }

        if(!user && isMounted) generateToken()
        return () => isMounted = false
    },[])
    
    return (
        !user?.user 
        ? <Outlet /> 
        : <Navigate to={location?.state?.from?.pathname || '/'} state={{from: location}} replace />
    )
}

export default NotAuthRoutes