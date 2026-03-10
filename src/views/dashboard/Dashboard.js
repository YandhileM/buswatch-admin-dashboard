import React, { useState } from 'react'
import {
  CAlert,
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
import useStats from '../../hooks/useStats'
import { useIncidentsByDay, useIncidentsByHour, useTopRoutes, useSubscriptionGrowth } from '../../hooks/useAnalytics'

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

const Dashboard = () => {
  const [startDate, setStartDate] = useState(defaultStart)
  const [endDate, setEndDate] = useState(defaultEnd)

  const { stats, loading: statsLoading, error: statsError } = useStats()
  const { data: byDay, loading: byDayLoading } = useIncidentsByDay(startDate, endDate)
  const { data: byHour, loading: byHourLoading } = useIncidentsByHour(startDate, endDate)
  const { data: topRoutes, loading: topRoutesLoading } = useTopRoutes(10)
  const { data: growthData, loading: growthLoading } = useSubscriptionGrowth()

  return (
    <>
      {/* Section A — Date range */}
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

      {/* Section B — KPI cards */}
      {statsError && <CAlert color="danger">{statsError}</CAlert>}
      {statsLoading ? (
        <div className="text-center my-4">
          <CSpinner />
        </div>
      ) : (
        stats && (
          <>
            <CRow>
              <CCol xs={12} sm={6} xl={3}>
                <StatCard title="Total Buses" value={stats.totalBuses} />
              </CCol>
              <CCol xs={12} sm={6} xl={3}>
                <StatCard title="Total Routes" value={stats.totalRoutes} />
              </CCol>
              <CCol xs={12} sm={6} xl={3}>
                <StatCard title="Total Devices" value={stats.totalDevices} />
              </CCol>
              <CCol xs={12} sm={6} xl={3}>
                <StatCard title="Total Subscriptions" value={stats.totalSubscriptions} />
              </CCol>
              <CCol xs={12} sm={6} xl={3}>
                <StatCard title="Incidents Today" value={stats.incidentsToday} />
              </CCol>
              <CCol xs={12} sm={6} xl={3}>
                <StatCard title="Incidents This Week" value={stats.incidentsThisWeek} />
              </CCol>
              <CCol xs={12} sm={6} xl={3}>
                <StatCard title="Incidents This Month" value={stats.incidentsThisMonth} />
              </CCol>
              <CCol xs={12} sm={6} xl={3}>
                <StatCard
                  title="Active Devices (Last 7 Days)"
                  value={stats.activeDevicesLast7Days}
                />
              </CCol>
            </CRow>

            {stats.mostActiveRouteId && (
              <CCard color="danger" textColor="white" className="mb-4">
                <CCardBody>
                  <strong>Most Active Route:</strong> {stats.mostActiveRouteName} —{' '}
                  {stats.mostActiveRouteIncidentCount} incidents
                </CCardBody>
              </CCard>
            )}
          </>
        )
      )}

      {/* Section C — Charts */}
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

      {/* Section C2 — Subscription Growth */}
      <CRow className="mb-4">
        <CCol md={12}>
          <CCard>
            <CCardHeader>Subscription Growth</CCardHeader>
            <CCardBody>
              {growthLoading ? (
                <div className="text-center my-4">
                  <CSpinner />
                </div>
              ) : (
                <CChart
                  type="line"
                  style={{ height: '200px' }}
                  data={{
                    labels: growthData.map((d) => d.date),
                    datasets: [
                      {
                        label: 'Subscriptions',
                        data: growthData.map((d) => d.cumulativeCount),
                        borderColor: '#2eb85c',
                        fill: true,
                        backgroundColor: 'rgba(46, 184, 92, 0.1)',
                      },
                    ],
                  }}
                />
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Section D — Top Routes table */}
      <CCard>
        <CCardHeader>Top 10 Routes by Incidents</CCardHeader>
        <CCardBody>
          {topRoutesLoading ? (
            <div className="text-center my-4">
              <CSpinner />
            </div>
          ) : (
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Rank</CTableHeaderCell>
                  <CTableHeaderCell>Route Name</CTableHeaderCell>
                  <CTableHeaderCell>Origin</CTableHeaderCell>
                  <CTableHeaderCell>Destination</CTableHeaderCell>
                  <CTableHeaderCell>Incident Count</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {topRoutes.map((route, index) => (
                  <CTableRow key={route.routeId}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{route.routeName}</CTableDataCell>
                    <CTableDataCell>{route.origin}</CTableDataCell>
                    <CTableDataCell>{route.destination}</CTableDataCell>
                    <CTableDataCell>{route.incidentCount}</CTableDataCell>
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

export default Dashboard
