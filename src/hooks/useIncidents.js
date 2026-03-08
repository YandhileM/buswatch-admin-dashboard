import { useState, useEffect } from 'react'
import apiClient from '../api/apiClient'

const useIncidents = (page, pageSize, startDate, endDate, routeId, busId, refreshKey) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    const params = { page, pageSize }
    if (startDate) params.startDate = startDate.toISOString()
    if (endDate) params.endDate = endDate.toISOString()
    if (routeId) params.routeId = routeId
    if (busId) params.busId = busId

    apiClient.get('/admin/incident-reports', { params })
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [page, pageSize, startDate?.toISOString(), endDate?.toISOString(), routeId, busId, refreshKey])

  return { data, loading, error }
}

export default useIncidents
