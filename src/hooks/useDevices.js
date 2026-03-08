import { useState, useEffect } from 'react'
import apiClient from '../api/apiClient'

const useDevices = (page, pageSize) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    apiClient.get('/admin/devices', { params: { page, pageSize } })
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [page, pageSize])

  return { data, loading, error }
}

export default useDevices
