import api from './api'

// Get all transactions
export const getTransactions = async (userId, params = {}) => {
  const queryParams = new URLSearchParams(params).toString()
  const response = await api.get(
    `/transactions/${userId}${queryParams ? `?${queryParams}` : ''}`,
  )
  return response.data
}

// Get unlabelled transactions
export const getUnlabelledTransactions = async (userId) => {
  const response = await api.get(`/transactions/${userId}/unlabelled`)
  return response.data
}

// Get monthly aggregation
export const getMonthlyAggregation = async (userId, year, month) => {
  const response = await api.get(
    `/transactions/${userId}/monthly?year=${year}&month=${month}`,
  )
  return response.data
}

// Create transaction
export const createTransaction = async (data) => {
  const response = await api.post('/transactions', data)
  return response.data
}

// Relabel single transaction
export const relabelTransaction = async (transactionId, categoryLabel) => {
  const response = await api.put(`/transactions/${transactionId}/relabel`, {
    categoryLabel,
  })
  return response.data
}

// Batch relabel transactions
export const relabelBatch = async (transactionIds, categoryLabel) => {
  const response = await api.put('/transactions/relabel-batch', {
    transactionIds,
    categoryLabel,
  })
  return response.data
}

// ============================================================
// LINKED ACCOUNT API
// ============================================================

// Get all linked accounts
export const getLinkedAccounts = async (userId) => {
  const response = await api.get(`/linked-accounts/${userId}`)
  return response.data
}

// Get account summary
export const getAccountSummary = async (userId) => {
  const response = await api.get(`/linked-accounts/${userId}/summary`)
  return response.data
}

// Link new account
export const linkAccount = async (data) => {
  const response = await api.post('/linked-accounts', data)
  return response.data
}

// Update account balance
export const updateAccountBalance = async (accountId, balance) => {
  const response = await api.put(`/linked-accounts/${accountId}/balance`, {
    balance,
  })
  return response.data
}

// Unlink account
export const unlinkAccount = async (accountId) => {
  const response = await api.delete(`/linked-accounts/${accountId}`)
  return response.data
}

// ============================================================
// CATEGORY OPTIONS (Icons from lucide-react)
// ============================================================

// Icon names reference (use with lucide-react):
// expense: Home, UtensilsCrossed, Car, Film, Pill, GraduationCap, ShoppingBag, FileText, Package
// income: DollarSign, Briefcase, TrendingUp, Gift, Sparkles

export const EXPENSE_CATEGORIES = [
  { id: 'perumahan', label: 'Perumahan', iconName: 'Home' },
  { id: 'makanan', label: 'Makanan', iconName: 'UtensilsCrossed' },
  { id: 'transport', label: 'Transport', iconName: 'Car' },
  { id: 'hiburan', label: 'Hiburan', iconName: 'Film' },
  { id: 'kesehatan', label: 'Kesehatan', iconName: 'Pill' },
  { id: 'pendidikan', label: 'Pendidikan', iconName: 'GraduationCap' },
  { id: 'belanja', label: 'Belanja', iconName: 'ShoppingBag' },
  { id: 'tagihan', label: 'Tagihan', iconName: 'FileText' },
  { id: 'lainnya', label: 'Lainnya', iconName: 'Package' },
]

export const INCOME_CATEGORIES = [
  { id: 'gaji', label: 'Gaji', iconName: 'DollarSign' },
  { id: 'freelance', label: 'Freelance', iconName: 'Briefcase' },
  { id: 'investasi', label: 'Investasi', iconName: 'TrendingUp' },
  { id: 'hadiah', label: 'Hadiah', iconName: 'Gift' },
  { id: 'lainnya', label: 'Lainnya', iconName: 'Sparkles' },
]

// ============================================================
// LABEL RULES API
// ============================================================
// Save a label rule to user's labelRules
export const saveLabelRule = async (userId, description, categoryLabel) => {
  const response = await api.put(`/users/${userId}/label-rules`, {
    description,
    categoryLabel,
  })
  return response.data
}
// Get user's label rules
export const getLabelRules = async (userId) => {
  const response = await api.get(`/users/${userId}/label-rules`)
  return response.data
}
