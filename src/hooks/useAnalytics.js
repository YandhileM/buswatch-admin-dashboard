import { useState, useEffect } from 'react'
import apiClient from '../api/apiClient'

export const useIncidentsByDay = (startDate, endDate) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    apiClient.get('/admin/analytics/incidents-by-day', {
      params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
    })
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [startDate.toISOString(), endDate.toISOString()])

  return { data, loading, error }
}

export const useIncidentsByHour = (startDate, endDate) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    apiClient.get('/admin/analytics/incidents-by-hour', {
      params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
    })
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [startDate.toISOString(), endDate.toISOString()])

  return { data, loading, error }
}

export const useTopRoutes = (limit = 10) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiClient.get('/admin/analytics/top-routes', { params: { limit } })
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [limit])

  return { data, loading, error }
}
