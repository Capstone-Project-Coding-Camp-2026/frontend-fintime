import api from '../../lib/api'

export const getReports = async (userId, filters = {}) => {
  const params = new URLSearchParams()
  if (filters.startDate) params.append('start_date', filters.startDate)
  if (filters.endDate) params.append('end_date', filters.endDate)
  if (filters.category) params.append('category', filters.category)
  if (filters.type) params.append('type', filters.type)

  const response = await api.get(`/reports/${userId}?${params.toString()}`)
  return response.data
}

export const getReportSummary = async (userId, period = 'month') => {
  const response = await api.get(`/reports/${userId}/summary?period=${period}`)
  return response.data
}

export const exportReportCSV = async (userId, filters = {}) => {
  const params = new URLSearchParams()
  if (filters.startDate) params.append('start_date', filters.startDate)
  if (filters.endDate) params.append('end_date', filters.endDate)
  if (filters.category) params.append('category', filters.category)

  const response = await api.get(`/reports/${userId}/export/csv?${params.toString()}`, {
    responseType: 'blob',
  })
  return response.data
}

export const exportReportPDF = async (userId, filters = {}) => {
  const params = new URLSearchParams()
  if (filters.startDate) params.append('start_date', filters.startDate)
  if (filters.endDate) params.append('end_date', filters.endDate)
  if (filters.category) params.append('category', filters.category)

  const response = await api.get(`/reports/${userId}/export/pdf?${params.toString()}`, {
    responseType: 'blob',
  })
  return response.data
}