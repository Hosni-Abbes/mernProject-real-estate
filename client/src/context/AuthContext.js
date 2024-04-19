import { createContext, useState } from "react"
import axios from "../api/axios"

const AuthContext = createContext({})

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState()
    const [error, setError] = useState()


    // Login
    const login = async userData => {
        try {
            const res = await axios.post('/api/v1/auth/login', userData, {withCredentials:true} )
            setError('')
            setUser(res.data)
        } catch (error) {
            setError(error.response?.data?.message)
            console.error(error)
        }
    }

    // Register
    const register = async userData => {
        try {
            await axios.post('/api/v1/auth/register', userData)
            setError('')
            setMessage('Account created successfully')
            
        } catch (error) {
            setError(error.response.data.message)
            console.error(error)
        }
    }


    // Logout
    const logout = async () => {
        try {
            await axios.get('/api/v1/auth/logout', {withCredentials:true})
            setUser(null)
            setError('')
            setMessage('')
        } catch (error) {
            setError(error.response?.data?.message || 'Internal server error!')
            console.error(error)
        }
    }


    return <AuthContext.Provider value={{
        login, register, logout, message, setMessage, error, setError, user, setUser
    }}>
        {children}
    </AuthContext.Provider>
}



export default AuthContext