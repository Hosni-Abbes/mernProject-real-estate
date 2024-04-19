const { useEffect } = require("react");

export const useDocTitle = (title) => {
    useEffect(()=> {
        const prevTitle = document.title
        document.title = title
        return () => document.title = prevTitle

    },[])
}