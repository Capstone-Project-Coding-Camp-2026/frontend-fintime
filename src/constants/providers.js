export const PROVIDERS = {
  banks: [
    { id: 'bca', name: 'BCA', type: 'bank' },
    { id: 'mandiri', name: 'Mandiri', type: 'bank' },
    { id: 'bni', name: 'BNI', type: 'bank' },
    { id: 'bri', name: 'BRI', type: 'bank' },
    { id: 'btn', name: 'BTN', type: 'bank' },
    { id: 'cimb', name: 'CIMB Niaga', type: 'bank' },
    { id: 'permata', name: 'Permata', type: 'bank' },
    { id: 'danamon', name: 'Danamon', type: 'bank' },
    { id: 'ocbc', name: 'OCBC', type: 'bank' },
    { id: 'jago', name: 'Jago', type: 'bank' },
    { id: 'seabank', name: 'SeaBank', type: 'bank' },
    { id: 'mega', name: 'Mega', type: 'bank' },
    { id: 'uob', name: 'UOB', type: 'bank' },
    { id: 'panin', name: 'Panin', type: 'bank' },
    { id: 'muamalat', name: 'Muamalat', type: 'bank' },
    { id: 'bsi', name: 'BSI', type: 'bank' },
    { id: 'nobu', name: 'Nobu', type: 'bank' },
    { id: 'maybank', name: 'Maybank', type: 'bank' },
    { id: 'sinarmas', name: 'Sinarmas', type: 'bank' },
  ],
  ewallets: [
    { id: 'gopay', name: 'GoPay', type: 'ewallet' },
    { id: 'ovo', name: 'OVO', type: 'ewallet' },
    { id: 'dana', name: 'DANA', type: 'ewallet' },
    { id: 'shopeepay', name: 'ShopeePay', type: 'ewallet' },
    { id: 'linkaja', name: 'LinkAja', type: 'ewallet' },
    { id: 'blu', name: 'Blu', type: 'ewallet' },
    { id: 'isaku', name: 'i.Saku', type: 'ewallet' },
    { id: 'dana_digi', name: 'Digi', type: 'ewallet' },
    { id: 'octoplus', name: 'Octoplus', type: 'ewallet' },
  ],
}

export const ALL_PROVIDERS = [...PROVIDERS.banks, ...PROVIDERS.ewallets]

export const PROVIDER_MAP = ALL_PROVIDERS.reduce((acc, p) => {
  acc[p.id] = p
  return acc
}, {})

export function getProviderById(id) {
  return PROVIDER_MAP[id] || null
}

export function getProviderName(id) {
  const provider = PROVIDER_MAP[id]
  return provider ? provider.name : (id ? id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, ' ') : 'Unknown')
}

export function getProviderType(id) {
  const provider = PROVIDER_MAP[id]
  return provider ? provider.type : 'bank'
}

export function getProviderStyle(id) {
  return null
}

export function isEWallet(id) {
  return getProviderType(id) === 'ewallet'
}

export function isBank(id) {
  return getProviderType(id) === 'bank'
}