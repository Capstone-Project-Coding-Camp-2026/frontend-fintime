import api from '../../lib/api'

export const getGoals = async (userId) => {
  const response = await api.get(`/goals/${userId}`)
  return response.data
}

export const createGoal = async (userId, goalData) => {
  const response = await api.post(`/goals/${userId}`, goalData)
  return response.data
}

export const updateGoal = async (goalId, goalData) => {
  const response = await api.put(`/goals/${goalId}`, goalData)
  return response.data
}

export const deleteGoal = async (goalId) => {
  const response = await api.delete(`/goals/${goalId}`)
  return response.data
}

export const addSavings = async (goalId, amount) => {
  const response = await api.post(`/goals/${goalId}/savings`, { amount })
  return response.data
}