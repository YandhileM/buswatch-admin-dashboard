import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CAlert,
  CBadge,
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
import { useBusDetail, useIncidentsByDay, useIncidentsByHour, useIncidentsByType } from '../../hooks/useAnalytics'

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

const BusDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [startDate, setStartDate] = useState(defaultStart)
  const [endDate, setEndDate] = useState(defaultEnd)

  const [incidents, setIncidents] = useState([])
  const [incidentsLoading, setIncidentsLoading] = useState(true)
  const [incidentsError, setIncidentsError] = useState(null)

  const { bus, loading, error } = useBusDetail(id)
  const { data: byDay, loading: byDayLoading } = useIncidentsByDay(startDate, endDate, null, id)
  const { data: byHour, loading: byHourLoading } = useIncidentsByHour(startDate, endDate, null, id)
  const { data: typeData, loading: typeLoading } = useIncidentsByType(null, id)

  useEffect(() => {
    if (!id) return
    setIncidentsLoading(true)
    apiClient
      .get('/admin/incident-reports', { params: { busId: id, pageSize: 50 } })
      .then((res) => setIncidents(res.data.items ?? []))
      .catch((err) => setIncidentsError(err.message))
      .finally(() => setIncidentsLoading(false))
  }, [id])

  if (loading)
    return (
      <div className="text-center my-5">
        <CSpinner />
      </div>
    )
  if (error) return <CAlert color="danger">{error}</CAlert>

  return (
    <>
      {/* Section A — Header */}
      <div className="mb-4">
        <CButton color="secondary" className="mb-3" onClick={() => navigate('/buses')}>
          Back to Buses
        </CButton>
        <h4 className="mb-1">
          Bus {bus.id} — {bus.departTime} {bus.direction}
        </h4>
        <p className="text-medium-emphasis mb-0">
          {bus.routeName}: {bus.originStop} &rarr; {bus.destinationStop}
        </p>
      </div>

      {/* Section B — Stat cards */}
      <CRow>
        <CCol md={6}>
          <StatCard title="Subscriptions" value={bus.subscriptionCount} />
        </CCol>
        <CCol md={6}>
          <StatCard title="Total Incidents" value={bus.incidentCount} />
        </CCol>
      </CRow>

      {/* Section B2 — Incidents by Type */}
      <CRow className="mb-4">
        <CCol md={6}>
          <CCard>
            <CCardHeader>Incidents by Type</CCardHeader>
            <CCardBody>
              {typeLoading ? (
                <div className="text-center my-4"><CSpinner /></div>
              ) : (
                <CChart
                  type="pie"
                  style={{ height: '250px' }}
                  data={{
                    labels: typeData.map((d) => d.reportTypeName),
                    datasets: [{
                      data: typeData.map((d) => d.count),
                      backgroundColor: ['#2eb85c', '#321fdb', '#e55353', '#f9b115', '#768192'],
                    }],
                  }}
                />
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard>
            <CCardHeader>Incident Breakdown</CCardHeader>
            <CCardBody>
              {typeLoading ? (
                <div className="text-center my-4"><CSpinner /></div>
              ) : (
                <CTable striped hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      <CTableHeaderCell>Count</CTableHeaderCell>
                      <CTableHeaderCell>% of Total</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {(() => {
                      const totalIncidents = typeData.reduce((sum, d) => sum + d.count, 0)
                      return typeData.map((d) => (
                        <CTableRow key={d.reportTypeName}>
                          <CTableDataCell>{d.reportTypeName}</CTableDataCell>
                          <CTableDataCell>{d.count}</CTableDataCell>
                          <CTableDataCell>
                            {totalIncidents > 0 ? Math.round((d.count / totalIncidents) * 100) : 0}%
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    })()}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
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
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </CCol>
            <CCol xs={12} sm={6} md={4} lg={3}>
              <CFormLabel>End Date</CFormLabel>
              <CFormInput
                type="date"
                value={endDate.toISOString().split('T')[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
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
                <div className="text-center my-4">
                  <CSpinner />
                </div>
              ) : (
                <CChart
                  type="line"
                  style={{ height: '200px' }}
                  data={{
                    labels: byDay.map((d) => d.date),
                    datasets: [
                      {
                        label: 'Incidents',
                        data: byDay.map((d) => d.count),
                        borderColor: '#2eb85c',
                        fill: false,
                      },
                    ],
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
                <div className="text-center my-4">
                  <CSpinner />
                </div>
              ) : (
                <CChart
                  type="bar"
                  style={{ height: '200px' }}
                  data={{
                    labels: byHour.map((d) => `${d.hour}:00`),
                    datasets: [
                      {
                        label: 'Incidents',
                        data: byHour.map((d) => d.count),
                        backgroundColor: '#2eb85c',
                      },
                    ],
                  }}
                />
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Section D — Incidents table */}
      <CCard>
        <CCardHeader>Recent Incidents</CCardHeader>
        <CCardBody>
          {incidentsError && <CAlert color="danger">{incidentsError}</CAlert>}
          {incidentsLoading ? (
            <div className="text-center my-4">
              <CSpinner />
            </div>
          ) : incidents.length === 0 ? (
            <CAlert color="info">No incidents found for this bus.</CAlert>
          ) : (
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Depart Time</CTableHeaderCell>
                  <CTableHeaderCell>Created At</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {incidents.map((i) => (
                  <CTableRow key={i.id}>
                    <CTableDataCell>
                      {i.description
                        ? i.description.slice(0, 60) + (i.description.length > 60 ? '…' : '')
                        : '—'}
                    </CTableDataCell>
                    <CTableDataCell>{i.bus?.departTime ?? '—'}</CTableDataCell>
                    <CTableDataCell>{new Date(i.createdAt).toLocaleString()}</CTableDataCell>
                    <CTableDataCell>
                      {i.deletedAt ? (
                        <CBadge color="secondary">Deleted</CBadge>
                      ) : (
                        <CBadge color="success">Active</CBadge>
                      )}
                    </CTableDataCell>
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

export default BusDetail
