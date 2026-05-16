export { ALL_PROVIDERS as BANK_EWALLET_OPTIONS } from '../../constants/providers'


export const INCOME_OPTIONS = [
  { key: '< 5jt', label: 'Kurang dari 5 juta' },
  { key: '5jt - 10jt', label: '5 juta — 10 juta' },
  { key: '10jt - 20jt', label: '10 juta — 20 juta' },
  { key: '20jt - 50jt', label: '20 juta — 50 juta' },
  { key: '> 50jt', label: 'Lebih dari 50 juta' },
]

export const STEP_LABELS = ['DATA DIRI', 'KONTAK', 'FINANSIAL', 'AKUN BANK', 'PENSIUN']


export const STEPS = ['personal', 'contact', 'financial', 'bank', 'pension']


export const INITIAL_FORM_DATA = {
  fullName: '',
  gender: '',
  birthDate: '',
  jobType: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  monthlyIncome: '',
  linkedAccounts: [],
  retirementAge: 55,
}
