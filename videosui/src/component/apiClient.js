import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:8000'
})

// Use Axios to fetch videos from django backend REST API

export const getVideosPage = async (pageParam = 1, username='', filter='', sortorder='', options = {}) => {
    const response = await api.get(`/videolist?p=${pageParam}&s=10&c=${username}&f=${filter}&o=${sortorder}`, options)
    return response.data
}