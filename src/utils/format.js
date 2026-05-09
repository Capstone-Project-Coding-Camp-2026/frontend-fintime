export function formatRupiah(amount, compact = false) {
  if (compact) {
    if (Math.abs(amount) >= 1_000_000_000) {
      return `Rp ${(amount / 1_000_000_000).toFixed(1)}B`
    }
    if (Math.abs(amount) >= 1_000_000) {
      return `Rp ${(amount / 1_000_000).toFixed(1)}M`
    }
    return `Rp ${(amount / 1_000).toFixed(0)}K`
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCompact(n) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`
  return String(n)
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}