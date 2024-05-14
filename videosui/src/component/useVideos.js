import { useState, useEffect } from 'react'
import { getVideosPage } from './apiClient'

// Create a custom hook to fetch data from django backend REST API
// It will handle loading and error state

const useVideos = (pageNum = 1, username = '', filter='', sortorder='') => {
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState({})
    const [hasNextPage, setHasNextPage] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        setIsError(false)
        setError({})

        const controller = new AbortController()
        const { signal } = controller

        getVideosPage(pageNum, username, filter, sortorder, { signal })
            .then(data => {
                setResults(prev => [...prev, ...data])
                setHasNextPage(Boolean(data.length))
                setIsLoading(false)
            })
            .catch(e => {
                setIsLoading(false)
                if (signal.aborted) return
                setIsError(true)
                setError({ message: e.message })
            })

        return () => controller.abort()

    }, [pageNum])

    return { isLoading, isError, error, results, hasNextPage }
}

export default useVideos