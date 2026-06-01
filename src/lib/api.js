import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Menambahkan token JWT ke header
api.interceptors.request.use(
  (config) => {
    // Cek kedua kemungkinan key agar tidak error
    const token = localStorage.getItem('fintime_token') || localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const fetcher = (url) => api.get(url).then((res) => res.data)

export default api
