import api from '../../lib/api'

export const getDebts = async (userId) => {
  const response = await api.get(`/debts/${userId}`)
  return response.data
}

export const createDebt = async (userId, debtData) => {
  const response = await api.post(`/debts/${userId}`, debtData)
  return response.data
}

export const updateDebt = async (debtId, debtData) => {
  const response = await api.put(`/debts/${debtId}`, debtData)
  return response.data
}

export const deleteDebt = async (debtId) => {
  const response = await api.delete(`/debts/${debtId}`)
  return response.data
}

export const recordPayment = async (debtId, paymentData) => {
  const response = await api.post(`/debts/${debtId}/payments`, paymentData)
  return response.data
}