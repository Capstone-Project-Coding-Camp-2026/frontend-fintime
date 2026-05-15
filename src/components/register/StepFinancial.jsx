import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

export function StepFinancial({ data, setData }) {
  const handleIncomeChange = (value) => {
    const numericValue = value.replace(/\D/g, '')
    setData(d => ({ ...d, monthlyIncome: numericValue }))
  }

  const formatDisplay = (value) => {
    if (!value) return ''
    return parseInt(value).toLocaleString('id-ID')
  }

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6"
    >

      <div>
        <div className="section-label">Step 3 of 5</div>
        <h2 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
          Kondisi <span className="grad-text">Keuanganmu</span>
        </h2>
        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
          Masukkan penghasilan bulanan Anda secara aktual untuk proyeksi yang akurat.
        </p>
      </div>

      <div className="flex flex-col gap-5">

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
            Pendapatan Utama Bulanan <span style={{ color: '#00f5ff' }}>*</span>
          </label>

          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold"
              style={{ color: 'var(--text-dim)' }}
            >
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={formatDisplay(data.monthlyIncome)}
              onChange={(e) => handleIncomeChange(e.target.value)}
              placeholder="0"
              className="w-full h-14 rounded-xl pl-10 pr-4 text-lg font-semibold"
              style={{
                background: 'rgba(0, 245, 255, 0.04)',
                border: '1px solid rgba(0, 245, 255, 0.12)',
                color: 'var(--text)',
                fontFamily: 'Sora, sans-serif',
                outline: 'none',
              }}
            />
          </div>

          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            Masukkan nominal dalam Rupiah. Contoh: 5000000 untuk Rp 5.000.000
          </p>
        </div>

        {data.monthlyIncome && parseInt(data.monthlyIncome) > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl flex items-center gap-4"
            style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.1)' }}
          >
            <TrendingUp size={18} style={{ color: '#00f5ff' }} />
            <div>
              <div className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--text-dim)' }}>
                Pendapatan Terinput
              </div>
              <div className="text-lg font-bold font-mono" style={{ color: '#00f5ff' }}>
                Rp {formatDisplay(data.monthlyIncome)} / bulan
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}