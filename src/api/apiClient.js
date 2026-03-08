import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'x-admin-key': import.meta.env.VITE_ADMIN_API_KEY,
  },
})

export default apiClient
