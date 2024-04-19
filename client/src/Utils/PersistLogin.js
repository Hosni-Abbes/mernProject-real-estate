import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useRefreshToken } from "../hooks/useRefreshToken"
import { Outlet } from "react-router-dom"

function PersistLogin() {
    const { user } = useAuth()
    const refresh = useRefreshToken()
    const [loading, setLoading] = useState(true)


    useEffect(()=>{
        const regenerateToken = async () => {
            try { await refresh()
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        !user?.accesstoken ? regenerateToken() : setLoading(false)

    }, [])


    return <Outlet />
    
}

export default PersistLogin