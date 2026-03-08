import { useState, useEffect } from 'react'
import apiClient from '../api/apiClient'

const useBuses = (page, pageSize, routeId) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    const params = { page, pageSize }
    if (routeId) params.routeId = routeId
    apiClient.get('/admin/buses', { params })
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [page, pageSize, routeId])

  return { data, loading, error }
}

export default useBuses
