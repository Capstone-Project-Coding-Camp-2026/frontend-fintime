import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Check, Info } from 'lucide-react'
import { BANK_EWALLET_OPTIONS } from './registerConstants'

// ============================================================
// STEP 4: AKUN BANK & E-WALLET
// Form pemilihan bank dan e-wallet
// ============================================================
export function StepBankEWallet({ data, setData }) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')

  // Filter data berdasarkan search dan type
  const filtered = BANK_EWALLET_OPTIONS.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || item.type === filterType
    return matchSearch && matchType
  })

  // Toggle pilih bank/e-wallet
  const toggleItem = (id) => {
    setData(d => {
      const current = d.linkedAccounts || []
      const exists = current.includes(id)
      return {
        ...d,
        linkedAccounts: exists ? current.filter(x => x !== id) : [...current, id],
      }
    })
  }

  const isSelected = (id) => (data.linkedAccounts || []).includes(id)

  return (
    <motion.div
      key="stepbank"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5"
    >
      
      <div>
        <div className="section-label">Step 4 of 5</div>
        <h2 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
          Hubungkan <span className="grad-text">Akun Finansial</span>
        </h2>
        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
          Pilih bank dan e-wallet yang ingin kamu hubungkan sebagai referensi utama proyeksi AI FinTime.
        </p>
      </div>

      
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-dim)' }} />
        <input
          type="text"
          placeholder="Cari bank atau e-wallet..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="finput"
        />
      </div>

      
      <div className="flex gap-2">
        {[
          { value: 'all', label: 'Semua' },
          { value: 'bank', label: 'Bank' },
          { value: 'ewallet', label: 'E-Wallet' },
        ].map(tab => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilterType(tab.value)}
            className="px-4 py-2 rounded-full text-xs font-bold transition-all duration-300"
            style={{
              background: filterType === tab.value ? 'rgba(0,245,255,0.12)' : 'rgba(0,245,255,0.04)',
              border: `1px solid ${filterType === tab.value ? 'rgba(0,245,255,0.4)' : 'rgba(0,245,255,0.1)'}`,
              color: filterType === tab.value ? '#00f5ff' : 'var(--text-dim)',
              fontFamily: 'Sora, sans-serif',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      
      <div className="flex flex-col gap-1.5 overflow-y-auto" style={{ maxHeight: '240px' }}>
        {filtered.length === 0 ? (
          <div className="text-center py-8" style={{ color: 'var(--text-dim)' }}>
            <Search size={24} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">Tidak ditemukan "{search}"</p>
          </div>
        ) : (
          filtered.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              className="flex items-center gap-3 rounded-xl py-2.5 px-3 transition-all duration-300 text-left"
              style={{
                background: isSelected(item.id) ? 'rgba(0,245,255,0.07)' : 'rgba(0,245,255,0.02)',
                border: `1px solid ${isSelected(item.id) ? 'rgba(0,245,255,0.4)' : 'rgba(0,245,255,0.07)'}`,
                fontFamily: 'Sora, sans-serif',
              }}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: item.color }}
              />
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-semibold truncate"
                  style={{ color: isSelected(item.id) ? '#00f5ff' : 'var(--text)' }}
                >
                  {item.name}
                </div>
              </div>
              
              <div
                className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-300"
                style={{
                  borderColor: isSelected(item.id) ? '#00f5ff' : 'rgba(0,245,255,0.25)',
                  background: isSelected(item.id) ? '#00f5ff' : 'transparent',
                }}
              >
                {isSelected(item.id) && <Check size={9} strokeWidth={3} color="#020b18" />}
              </div>
            </button>
          ))
        )}
      </div>

      
      {(data.linkedAccounts || []).length > 0 && (
        <div
          className="p-3 rounded-xl"
          style={{ background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.15)' }}
        >
          <div className="text-[10px] font-mono tracking-widest uppercase mb-2" style={{ color: 'var(--text-dim)' }}>
            Terpilih ({data.linkedAccounts.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.linkedAccounts.map(id => {
              const item = BANK_EWALLET_OPTIONS.find(x => x.id === id)
              if (!item) return null
              return (
                <div
                  key={id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}35`,
                    color: item.color,
                  }}
                >
                  {item.name}
                </div>
              )
            })}
          </div>
        </div>
      )}

      
      <div
        className="flex items-start gap-2 p-3 rounded-xl"
        style={{ background: 'rgba(0,180,216,0.04)', border: '1px solid rgba(0,180,216,0.1)' }}
      >
        <Info size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#00b4d8' }} />
        <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>
          Semua data bersifat simulasi/demo. Kami tidak melakukan request ke bank atau e-wallet manapun.
        </p>
      </div>
    </motion.div>
  )
}
