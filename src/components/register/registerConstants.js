export const BANK_EWALLET_OPTIONS = [
  // List Bank
  { id: 'bca', name: 'Bank BCA', type: 'bank', color: '#00457c' },
  { id: 'mandiri', name: 'Bank Mandiri', type: 'bank', color: '#003d7a' },
  { id: 'bni', name: 'Bank BNI', type: 'bank', color: '#e70000' },
  { id: 'bri', name: 'Bank BRI', type: 'bank', color: '#0042a5' },
  { id: 'btpn', name: 'BTPN / Jenius', type: 'bank', color: '#e8521f' },
  { id: 'cimb', name: 'CIMB Niaga', type: 'bank', color: '#005ca8' },
  { id: 'permata', name: 'Bank Permata', type: 'bank', color: '#005f41' },
  { id: 'danamon', name: 'Bank Danamon', type: 'bank', color: '#ff6600' },
  { id: 'ocbc', name: 'OCBC NISP', type: 'bank', color: '#f5c800' },
  { id: 'bankjago', name: 'Bank Jago', type: 'bank', color: '#00a651' },
  { id: 'sea_bank', name: 'SeaBank', type: 'bank', color: '#00adcc' },
  { id: 'mega', name: 'Bank Mega', type: 'bank', color: '#7b1d8d' },
  { id: 'uob', name: 'UOB Indonesia', type: 'bank', color: '#003c7d' },
  { id: 'panin', name: 'Bank Panin', type: 'bank', color: '#ff6b00' },
  { id: 'bukopin', name: 'Bank Bukopin', type: 'bank', color: '#7a4500' },
  { id: 'bankbtn', name: 'Bank BTN', type: 'bank', color: '#003a70' },
  { id: 'bankbsi', name: 'Bank BSI', type: 'bank', color: '#00a651' },
  { id: 'bankmuamalat', name: 'Bank Muamalat', type: 'bank', color: '#005d36' },

  // List E-Wallet
  { id: 'gopay', name: 'GoPay', type: 'ewallet', color: '#00a100' },
  { id: 'ovo', name: 'OVO', type: 'ewallet', color: '#440099' },
  { id: 'dana', name: 'DANA', type: 'ewallet', color: '#0087fe' },
  { id: 'shopeepay', name: 'ShopeePay', type: 'ewallet', color: '#ff6600' },
  { id: 'linkaja', name: 'LinkAja', type: 'ewallet', color: '#e70000' },
  { id: 'sakuku', name: 'Sakuku BCA', type: 'ewallet', color: '#00457c' },
  { id: 'doku', name: 'DOKU', type: 'ewallet', color: '#6a2d8f' },
  { id: 'maxim', name: 'Maxi Inhealth', type: 'ewallet', color: '#f5a623' },
  { id: 'togo', name: 'Togo Dana', type: 'ewallet', color: '#ffd700' },
  { id: 'paytren', name: 'PayTren', type: 'ewallet', color: '#008b00' },
  { id: 'flixbiz', name: 'FlixBiz', type: 'ewallet', color: '#e50914' },
  { id: 'qris', name: 'QRIS (Multi Bank)', type: 'ewallet', color: '#7b1d8d' },
]


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
  occupation: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  monthlyIncome: '',
  linkedAccounts: [],
  retirementAge: 55,
}
