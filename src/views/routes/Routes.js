import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAlert,
  CCol,
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
import useRoutes from '../../hooks/useRoutes'

const Routes = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const { data, loading, error } = useRoutes(page, pageSize)

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
      <CRow className="mb-3 align-items-center">
        <CCol>
          <span className="text-medium-emphasis">
            Showing {items.length} of {totalCount} routes
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
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Origin</CTableHeaderCell>
                <CTableHeaderCell>Destination</CTableHeaderCell>
                <CTableHeaderCell>Buses</CTableHeaderCell>
                <CTableHeaderCell>Subscriptions</CTableHeaderCell>
                <CTableHeaderCell>Incidents</CTableHeaderCell>
                <CTableHeaderCell>Created At</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {items.map((r) => (
                <CTableRow
                  key={r.id}
                  onClick={() => navigate('/routes/' + r.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <CTableDataCell>{r.name}</CTableDataCell>
                  <CTableDataCell>{r.originStop?.name}</CTableDataCell>
                  <CTableDataCell>{r.destinationStop?.name}</CTableDataCell>
                  <CTableDataCell>{r.busCount}</CTableDataCell>
                  <CTableDataCell>{r.totalSubscriptions}</CTableDataCell>
                  <CTableDataCell>{r.totalIncidents}</CTableDataCell>
                  <CTableDataCell>{new Date(r.createdAt).toLocaleDateString()}</CTableDataCell>
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

export default Routes
