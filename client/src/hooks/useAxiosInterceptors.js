import { useEffect } from "react"
import { privateAxios } from "../api/axios"
import { useAuth } from "./useAuth"
import { useRefreshToken } from "./useRefreshToken"



const useAxiosInterceptors = () => {
    const { user } = useAuth()
    const refresh = useRefreshToken()

    useEffect(()=>{
        // create the request interceptor
        const requestInterceptor = privateAxios.interceptors.request.use(
            config => {
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${user?.accesstoken}`
                }
                return config
            }, (error) => Promise.reject(error)
        )
        // create the response interceptor
        const responseInterceptor = privateAxios.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config
                if(error?.response?.status === 403 && !prevRequest?.sent ){
                    prevRequest.sent = true
                    const newAccessToken = await refresh()
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                    return privateAxios(prevRequest)
                }
                return Promise.reject(error)
            }
        )

        // useEffect cleanup func to remove interceptors
        return () => {
            privateAxios.interceptors.request.eject(requestInterceptor)
            privateAxios.interceptors.response.eject(responseInterceptor)
        }

    }, [user, refresh])


    return privateAxios

}


export default useAxiosInterceptors