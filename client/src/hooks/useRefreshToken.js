import axios from "../api/axios"
import { useAuth } from "./useAuth"

export const useRefreshToken = () => {
    const { setUser } = useAuth()
    
    const refresh = async () => {
        const response = await axios.get('/api/v1/auth/refresh', { withCredentials: true })
        setUser(prev => {
            return {...prev, user: response.data.user, accesstoken: response.data.accesstoken}
        })
        return response.data.accesstoken
        
    }
    return refresh
}