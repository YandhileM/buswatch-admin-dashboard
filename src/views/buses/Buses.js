import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAlert,
  CCard,
  CCardBody,
  CCol,
  CFormLabel,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import useBuses from '../../hooks/useBuses'
import { useAllRoutes } from '../../hooks/useAnalytics'

const Buses = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [routeId, setRouteId] = useState('')

  const { data, loading, error } = useBuses(page, pageSize, routeId)
  const { routes } = useAllRoutes()

  const items = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1

  const getPaginationItems = (currentPage, total) => {
    const delta = 2
    const range = []
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(total, currentPage + delta); i++) {
      range.push(i)
    }
    return range
  }

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value))
    setPage(1)
  }

  return (
    <>
      {/* Route filter */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol xs={12} sm={6} md={4} lg={3}>
              <CFormLabel>Route</CFormLabel>
              <CFormSelect
                value={routeId}
                onChange={(e) => {
                  setRouteId(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">All Routes</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <CRow className="mb-3 align-items-center">
        <CCol>
          <span className="text-medium-emphasis">
            Showing {items.length} of {totalCount} buses
          </span>
        </CCol>
        <CCol xs="auto">
          <CFormSelect value={pageSize} onChange={handlePageSizeChange} style={{ width: 'auto' }}>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </CFormSelect>
        </CCol>
      </CRow>

      {error && <CAlert color="danger">{error}</CAlert>}
      {loading ? (
        <div className="text-center my-5">
          <CSpinner />
        </div>
      ) : (
        <>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Depart Time</CTableHeaderCell>
                <CTableHeaderCell>Direction</CTableHeaderCell>
                <CTableHeaderCell>Route</CTableHeaderCell>
                <CTableHeaderCell>Origin → Destination</CTableHeaderCell>
                <CTableHeaderCell>Subscriptions</CTableHeaderCell>
                <CTableHeaderCell>Incidents</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {items.map((b) => (
                <CTableRow
                  key={b.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/buses/' + b.id)}
                >
                  <CTableDataCell>{b.departTime}</CTableDataCell>
                  <CTableDataCell>{b.direction}</CTableDataCell>
                  <CTableDataCell>{b.route?.name}</CTableDataCell>
                  <CTableDataCell>
                    {b.route?.originStopName} → {b.route?.destinationStopName}
                  </CTableDataCell>
                  <CTableDataCell>{b.subscriptionCount}</CTableDataCell>
                  <CTableDataCell>{b.incidentCount}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          {totalPages > 1 && (
            <CPagination className="mt-3">
              <CPaginationItem disabled={page === 1} onClick={() => setPage(1)}>
                First
              </CPaginationItem>
              <CPaginationItem disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Prev
              </CPaginationItem>
              {getPaginationItems(page, totalPages).map((n) => (
                <CPaginationItem key={n} active={n === page} onClick={() => setPage(n)}>
                  {n}
                </CPaginationItem>
              ))}
              <CPaginationItem disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </CPaginationItem>
              <CPaginationItem disabled={page === totalPages} onClick={() => setPage(totalPages)}>
                Last
              </CPaginationItem>
            </CPagination>
          )}
        </>
      )}
    </>
  )
}

export default Buses
