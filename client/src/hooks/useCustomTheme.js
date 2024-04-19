import { useEffect } from "react"

export const useCustomTheme = () => {
        useEffect(()=>{
        localStorage.getItem('theme') ? document.body.classList.add('dark-theme') : document.body.classList.remove('dark-theme')
    }, [])
}