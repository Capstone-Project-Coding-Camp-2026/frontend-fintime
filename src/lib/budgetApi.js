import api from '../../lib/api'

export const getBudgets = async (userId) => {
  const response = await api.get(`/budgets/${userId}`)
  return response.data
}

export const createBudget = async (userId, budgetData) => {
  const response = await api.post(`/budgets/${userId}`, budgetData)
  return response.data
}

export const updateBudget = async (budgetId, budgetData) => {
  const response = await api.put(`/budgets/${budgetId}`, budgetData)
  return response.data
}

export const deleteBudget = async (budgetId) => {
  const response = await api.delete(`/budgets/${budgetId}`)
  return response.data
}

export const getBudgetAlerts = async (userId) => {
  const response = await api.get(`/budgets/${userId}/alerts`)
  return response.data
}