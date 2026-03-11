import { useState, useEffect } from 'react'
import apiClient from '../api/apiClient'

export const useIncidentsByDay = (startDate, endDate, routeId = null, busId = null) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const params = { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
    if (routeId) params.routeId = routeId
    if (busId) params.busId = busId
    apiClient
      .get('/admin/analytics/incidents-by-day', { params })
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [startDate.toISOString(), endDate.toISOString(), routeId, busId])

  return { data, loading, error }
}

export const useIncidentsByHour = (startDate, endDate, routeId = null, busId = null) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const params = { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
    if (routeId) params.routeId = routeId
    if (busId) params.busId = busId
    apiClient
      .get('/admin/analytics/incidents-by-hour', { params })
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [startDate.toISOString(), endDate.toISOString(), routeId, busId])

  return { data, loading, error }
}

export const useTopRoutes = (limit = 10) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiClient
      .get('/admin/analytics/top-routes', { params: { limit } })
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [limit])

  return { data, loading, error }
}

export const useAllRoutes = () => {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient
      .get('/admin/routes', { params: { page: 1, pageSize: 100 } })
      .then((res) => setRoutes(res.data.items))
      .catch(() => setRoutes([]))
      .finally(() => setLoading(false))
  }, [])

  return { routes, loading }
}

export const useRouteDetail = (routeId) => {
  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!routeId) return
    apiClient
      .get(`/admin/routes/${routeId}`)
      .then((res) => setRoute(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [routeId])

  return { route, loading, error }
}

export const useSubscriptionGrowth = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiClient
      .get('/admin/analytics/subscription-growth')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

export const useBusDetail = (busId) => {
  const [bus, setBus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!busId) return
    setLoading(true)
    apiClient
      .get(`/admin/buses/${busId}`)
      .then((res) => setBus(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [busId])

  return { bus, loading, error }
}

export const useIncidentsByType = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiClient
      .get('/admin/analytics/incidents-by-type')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

export const useReportTypes = () => {
  const [reportTypes, setReportTypes] = useState([])

  useEffect(() => {
    apiClient
      .get('/report-types')
      .then((res) => setReportTypes(res.data))
      .catch(() => setReportTypes([]))
  }, [])

  return { reportTypes }
}
