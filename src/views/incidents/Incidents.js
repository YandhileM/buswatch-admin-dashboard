import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormInput,
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
import apiClient from '../../api/apiClient'
import useIncidents from '../../hooks/useIncidents'
import { useAllRoutes } from '../../hooks/useAnalytics'

const truncate = (str, len) => (str && str.length > len ? str.slice(0, len) + '...' : str)

const Incidents = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [routeId, setRouteId] = useState('')
  const [busId, setBusId] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const { data, loading, error } = useIncidents(
    page,
    pageSize,
    startDate,
    endDate,
    routeId,
    busId,
    refreshKey,
  )
  const { routes } = useAllRoutes()

  const handleClearFilters = () => {
    setStartDate(null)
    setEndDate(null)
    setRouteId('')
    setBusId('')
    setPage(1)
  }

  const handleDelete = (id) => {
    apiClient
      .delete(`/admin/incident-reports/${id}`)
      .then(() => setRefreshKey((k) => k + 1))
      .catch((err) => alert('Delete failed: ' + err.message))
  }

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value))
    setPage(1)
  }

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

  return (
    <>
      {/* Section A — Filters */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol xs={12} sm={6} md={3} lg={2}>
              <CFormLabel>Start Date</CFormLabel>
              <CFormInput
                type="date"
                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  setStartDate(e.target.value ? new Date(e.target.value) : null)
                  setPage(1)
                }}
              />
            </CCol>
            <CCol xs={12} sm={6} md={3} lg={2}>
              <CFormLabel>End Date</CFormLabel>
              <CFormInput
                type="date"
                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  setEndDate(e.target.value ? new Date(e.target.value) : null)
                  setPage(1)
                }}
              />
            </CCol>
            <CCol xs={12} sm={6} md={3} lg={2}>
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
            <CCol xs={12} sm={6} md={2} lg={2}>
              <CFormLabel>Bus ID</CFormLabel>
              <CFormInput
                type="number"
                placeholder="Bus ID"
                value={busId}
                onChange={(e) => {
                  setBusId(e.target.value)
                  setPage(1)
                }}
              />
            </CCol>
            <CCol xs={12} sm={6} md={2} lg={2}>
              <CButton color="secondary" onClick={handleClearFilters} className="w-100">
                Clear Filters
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Section B — Results info + page size + create button */}
      <CRow className="mb-3 align-items-center">
        <CCol>
          <span className="text-medium-emphasis">
            Showing {items.length} of {totalCount} incidents
          </span>
        </CCol>
        <CCol xs="auto" className="d-flex gap-2">
          <CFormSelect value={pageSize} onChange={handlePageSizeChange} style={{ width: 'auto' }}>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </CFormSelect>
          <CButton color="success" onClick={() => navigate('/incidents/new')}>
            Create Incident
          </CButton>
        </CCol>
      </CRow>

      {/* Section C — Table + pagination */}
      {error && <CAlert color="danger">{error}</CAlert>}
      {loading ? (
        <div className="text-center my-5">
          <CSpinner />
        </div>
      ) : items.length === 0 ? (
        <CAlert color="info">No incidents found.</CAlert>
      ) : (
        <>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Bus ID</CTableHeaderCell>
                <CTableHeaderCell>Depart Time</CTableHeaderCell>
                <CTableHeaderCell>Route</CTableHeaderCell>
                <CTableHeaderCell>Description</CTableHeaderCell>
                <CTableHeaderCell>Reported By</CTableHeaderCell>
                <CTableHeaderCell>Created At</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {items.map((i) => (
                <CTableRow key={i.id}>
                  <CTableDataCell>{i.busId}</CTableDataCell>
                  <CTableDataCell>{i.bus?.departTime}</CTableDataCell>
                  <CTableDataCell>{i.route?.name}</CTableDataCell>
                  <CTableDataCell>{truncate(i.description, 60)}</CTableDataCell>
                  <CTableDataCell>{truncate(i.createdByDevice?.hardwareId, 12)}</CTableDataCell>
                  <CTableDataCell>{new Date(i.createdAt).toLocaleString()}</CTableDataCell>
                  <CTableDataCell>
                    {i.deletedAt ? (
                      <CBadge color="danger">Deleted</CBadge>
                    ) : (
                      <CBadge color="success">Active</CBadge>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="danger"
                      size="sm"
                      disabled={!!i.deletedAt}
                      onClick={() => handleDelete(i.id)}
                    >
                      Delete
                    </CButton>
                  </CTableDataCell>
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

export default Incidents
