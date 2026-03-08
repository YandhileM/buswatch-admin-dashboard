import React, { useState } from 'react'
import {
  CAlert,
  CBadge,
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
import useDevices from '../../hooks/useDevices'

const Devices = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const { data, loading, error } = useDevices(page, pageSize)

  const items = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1

  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value))
    setPage(1)
  }

  return (
    <>
      <CRow className="mb-3 align-items-center">
        <CCol>
          <span className="text-medium-emphasis">
            Showing {items.length} of {totalCount} devices
          </span>
        </CCol>
        <CCol xs="auto">
          <CFormSelect
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ width: 'auto' }}
          >
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </CFormSelect>
        </CCol>
      </CRow>

      {error && <CAlert color="danger">{error}</CAlert>}
      {loading ? (
        <div className="text-center my-5"><CSpinner /></div>
      ) : (
        <>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Hardware ID</CTableHeaderCell>
                <CTableHeaderCell>Platform</CTableHeaderCell>
                <CTableHeaderCell>Notifications</CTableHeaderCell>
                <CTableHeaderCell>Subscriptions</CTableHeaderCell>
                <CTableHeaderCell>Incidents</CTableHeaderCell>
                <CTableHeaderCell>Registered</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {items.map(d => (
                <CTableRow key={d.id} className={d.deletedAt ? 'text-muted' : ''}>
                  <CTableDataCell>{d.id}</CTableDataCell>
                  <CTableDataCell>{d.hardwareId}</CTableDataCell>
                  <CTableDataCell>{d.platform}</CTableDataCell>
                  <CTableDataCell>
                    {d.notificationsEnabled
                      ? <CBadge color="success">On</CBadge>
                      : <CBadge color="secondary">Off</CBadge>
                    }
                  </CTableDataCell>
                  <CTableDataCell>{d.subscriptionCount}</CTableDataCell>
                  <CTableDataCell>{d.incidentCount}</CTableDataCell>
                  <CTableDataCell>{new Date(d.createdAt).toLocaleDateString()}</CTableDataCell>
                  <CTableDataCell>
                    {d.deletedAt
                      ? <CBadge color="danger">Deleted</CBadge>
                      : <CBadge color="success">Active</CBadge>
                    }
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          {totalPages > 1 && (
            <CPagination className="mt-3">
              <CPaginationItem disabled={page === 1} onClick={() => setPage(1)}>First</CPaginationItem>
              <CPaginationItem disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</CPaginationItem>
              {pageNumbers.map(n => (
                <CPaginationItem key={n} active={n === page} onClick={() => setPage(n)}>
                  {n}
                </CPaginationItem>
              ))}
              <CPaginationItem disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</CPaginationItem>
              <CPaginationItem disabled={page === totalPages} onClick={() => setPage(totalPages)}>Last</CPaginationItem>
            </CPagination>
          )}
        </>
      )}
    </>
  )
}

export default Devices
