import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
  CSpinner,
} from '@coreui/react'
import apiClient from '../../api/apiClient'
import { useAllRoutes, useReportTypes } from '../../hooks/useAnalytics'

const CreateIncident = () => {
  const navigate = useNavigate()

  const { routes, loading: routesLoading } = useAllRoutes()
  const { reportTypes } = useReportTypes()

  const [selectedRouteId, setSelectedRouteId] = useState('')
  const [buses, setBuses] = useState([])
  const [busesLoading, setBusesLoading] = useState(false)
  const [selectedBusId, setSelectedBusId] = useState('')
  const [selectedReportTypeId, setSelectedReportTypeId] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const handleRouteChange = (e) => {
    const routeId = e.target.value
    setSelectedRouteId(routeId)
    setBuses([])
    setSelectedBusId('')
    if (!routeId) return
    setBusesLoading(true)
    apiClient
      .get('/admin/buses', { params: { routeId, pageSize: 100 } })
      .then((res) => setBuses(res.data.items ?? []))
      .catch(() => setBuses([]))
      .finally(() => setBusesLoading(false))
  }

  const handleReportTypeChange = (e) => {
    const selectedId = parseInt(e.target.value)
    setSelectedReportTypeId(e.target.value)
    const selected = reportTypes.find((rt) => rt.id === selectedId)
    if (selected) setDescription(selected.description)
  }

  const canSubmit = selectedRouteId && selectedBusId && selectedReportTypeId && description.trim()

  const handleSubmit = () => {
    setSubmitting(true)
    setErrorMsg(null)
    apiClient
      .post('/admin/incident-reports', {
        busId: Number(selectedBusId),
        reportTypeId: Number(selectedReportTypeId),
        description: description.trim(),
        latitude: null,
        longitude: null,
      })
      .then(() => {
        setSuccessMsg('Incident created successfully. Redirecting...')
        setTimeout(() => navigate('/incidents'), 2000)
      })
      .catch((err) => setErrorMsg(err.response?.data?.detail ?? err.message))
      .finally(() => setSubmitting(false))
  }

  return (
    <>
      <CButton color="secondary" className="mb-4" onClick={() => navigate('/incidents')}>
        ← Back to Incidents
      </CButton>

      <CCard>
        <CCardHeader>
          <strong>Create Incident</strong>
        </CCardHeader>
        <CCardBody>
          {successMsg && <CAlert color="success">{successMsg}</CAlert>}
          {errorMsg && <CAlert color="danger">{errorMsg}</CAlert>}

          <CRow className="g-3">
            <CCol xs={12} md={6}>
              <CFormLabel>Route</CFormLabel>
              {routesLoading ? (
                <CSpinner size="sm" />
              ) : (
                <CFormSelect value={selectedRouteId} onChange={handleRouteChange}>
                  <option value="">Select a route...</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </CFormSelect>
              )}
            </CCol>

            <CCol xs={12} md={6}>
              <CFormLabel>Bus</CFormLabel>
              {busesLoading ? (
                <CSpinner size="sm" />
              ) : (
                <CFormSelect
                  value={selectedBusId}
                  onChange={(e) => setSelectedBusId(e.target.value)}
                  disabled={!selectedRouteId}
                >
                  <option value="">Select a bus...</option>
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.departTime} — {b.direction}
                    </option>
                  ))}
                </CFormSelect>
              )}
            </CCol>

            <CCol xs={12} md={6}>
              <CFormLabel>Report Type</CFormLabel>
              <CFormSelect
                value={selectedReportTypeId}
                onChange={handleReportTypeChange}
                disabled={!selectedBusId}
              >
                <option value="">Select a report type...</option>
                {reportTypes.map((rt) => (
                  <option key={rt.id} value={rt.id}>
                    {rt.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol xs={12}>
              <CFormLabel>Description</CFormLabel>
              <CFormTextarea
                rows={4}
                placeholder="Describe the incident..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </CCol>

            <CCol xs={12}>
              <CButton color="success" disabled={!canSubmit || submitting} onClick={handleSubmit}>
                {submitting ? <CSpinner size="sm" /> : 'Submit Incident'}
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default CreateIncident
