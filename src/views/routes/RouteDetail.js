import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import apiClient from '../../api/apiClient'
import { useRouteDetail, useIncidentsByDay, useIncidentsByHour } from '../../hooks/useAnalytics'

const defaultEnd = new Date()
const defaultStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

const StatCard = ({ title, value }) => (
  <CCard className="mb-4">
    <CCardBody className="text-center">
      <div className="fs-1 fw-bold">{value}</div>
      <div className="text-medium-emphasis">{title}</div>
    </CCardBody>
  </CCard>
)

const RouteDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [startDate, setStartDate] = useState(defaultStart)
  const [endDate, setEndDate] = useState(defaultEnd)

  const [buses, setBuses] = useState([])
  const [busesLoading, setBusesLoading] = useState(true)
  const [busesError, setBusesError] = useState(null)

  const { route, loading, error } = useRouteDetail(id)
  const { data: byDay, loading: byDayLoading } = useIncidentsByDay(startDate, endDate, id)
  const { data: byHour, loading: byHourLoading } = useIncidentsByHour(startDate, endDate, id)

  useEffect(() => {
    if (!id) return
    setBusesLoading(true)
    apiClient.get('/admin/buses', { params: { routeId: id, pageSize: 100 } })
      .then(res => setBuses(res.data.items ?? []))
      .catch(err => setBusesError(err.message))
      .finally(() => setBusesLoading(false))
  }, [id])

  if (loading) return <div className="text-center my-5"><CSpinner /></div>
  if (error) return <CAlert color="danger">{error}</CAlert>

  return (
    <>
      {/* Section A — Header */}
      <div className="mb-4">
        <CButton color="secondary" className="mb-3" onClick={() => navigate('/routes')}>
          Back to Routes
        </CButton>
        <h4 className="mb-1">{route.name}</h4>
        <p className="text-medium-emphasis mb-0">
          {route.originStop?.name} &rarr; {route.destinationStop?.name}
        </p>
      </div>

      {/* Section B — Stat cards */}
      <CRow>
        <CCol md={4}>
          <StatCard title="Total Buses" value={route.busCount} />
        </CCol>
        <CCol md={4}>
          <StatCard title="Total Subscriptions" value={route.totalSubscriptions} />
        </CCol>
        <CCol md={4}>
          <StatCard title="Total Incidents" value={route.totalIncidents} />
        </CCol>
      </CRow>

      {/* Section C — Date range + charts */}
      <CCard className="mb-4">
        <CCardHeader>Date Range</CCardHeader>
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol xs={12} sm={6} md={4} lg={3}>
              <CFormLabel>Start Date</CFormLabel>
              <CFormInput
                type="date"
                value={startDate.toISOString().split('T')[0]}
                onChange={e => setStartDate(new Date(e.target.value))}
              />
            </CCol>
            <CCol xs={12} sm={6} md={4} lg={3}>
              <CFormLabel>End Date</CFormLabel>
              <CFormInput
                type="date"
                value={endDate.toISOString().split('T')[0]}
                onChange={e => setEndDate(new Date(e.target.value))}
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <CRow className="mb-4">
        <CCol md={6}>
          <CCard>
            <CCardHeader>Incidents by Day</CCardHeader>
            <CCardBody>
              {byDayLoading ? (
                <div className="text-center my-4"><CSpinner /></div>
              ) : (
                <CChart
                  type="line"
                  data={{
                    labels: byDay.map(d => d.date),
                    datasets: [{
                      label: 'Incidents',
                      data: byDay.map(d => d.count),
                      borderColor: '#2eb85c',
                      fill: false,
                    }],
                  }}
                />
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard>
            <CCardHeader>Incidents by Hour</CCardHeader>
            <CCardBody>
              {byHourLoading ? (
                <div className="text-center my-4"><CSpinner /></div>
              ) : (
                <CChart
                  type="bar"
                  data={{
                    labels: byHour.map(d => `${d.hour}:00`),
                    datasets: [{
                      label: 'Incidents',
                      data: byHour.map(d => d.count),
                      backgroundColor: '#2eb85c',
                    }],
                  }}
                />
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Section D — Buses table */}
      <CCard>
        <CCardHeader>Buses on This Route</CCardHeader>
        <CCardBody>
          {busesError && <CAlert color="danger">{busesError}</CAlert>}
          {busesLoading ? (
            <div className="text-center my-4"><CSpinner /></div>
          ) : buses.length === 0 ? (
            <CAlert color="info">No buses found for this route.</CAlert>
          ) : (
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Bus ID</CTableHeaderCell>
                  <CTableHeaderCell>Depart Time</CTableHeaderCell>
                  <CTableHeaderCell>Direction</CTableHeaderCell>
                  <CTableHeaderCell>Subscriptions</CTableHeaderCell>
                  <CTableHeaderCell>Incidents</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {buses.map(b => (
                  <CTableRow key={b.id}>
                    <CTableDataCell>{b.id}</CTableDataCell>
                    <CTableDataCell>{b.departTime}</CTableDataCell>
                    <CTableDataCell>{b.direction}</CTableDataCell>
                    <CTableDataCell>{b.subscriptionCount}</CTableDataCell>
                    <CTableDataCell>{b.incidentCount}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default RouteDetail
