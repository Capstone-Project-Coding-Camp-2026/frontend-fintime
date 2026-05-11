import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { INCOME_OPTIONS } from './registerConstants'

// ============================================================
// STEP 3: FINANSIAL
// Form input kondisi keuangan (pendapatan bulanan)
// ============================================================
export function StepFinancial({ data, setData }) {
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
          Beritahu kami soal penghasilanmu supaya AI bisa membuat proyeksi yang pas untukmu.
        </p>
      </div>

      
      <div className="flex flex-col gap-5">
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
            Pendapatan Utama Bulanan <span style={{ color: '#00f5ff' }}>*</span>
          </label>
          <div className="flex flex-col gap-2">
            {INCOME_OPTIONS.map(opt => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setData(d => ({ ...d, monthlyIncome: opt.key }))}
                className="flex items-center gap-3 rounded-xl py-3 px-4 transition-all duration-300 text-left"
                style={{
                  background: data.monthlyIncome === opt.key ? 'rgba(0,245,255,0.1)' : 'rgba(0,245,255,0.04)',
                  border: `1px solid ${data.monthlyIncome === opt.key ? 'rgba(0,245,255,0.5)' : 'rgba(0,245,255,0.12)'}`,
                  fontFamily: 'Sora, sans-serif',
                }}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    borderColor: data.monthlyIncome === opt.key ? '#00f5ff' : 'rgba(0,245,255,0.3)',
                    background: data.monthlyIncome === opt.key ? '#00f5ff' : 'transparent',
                  }}
                >
                  {data.monthlyIncome === opt.key && (
                    <div className="w-2 h-2 rounded-full bg-[#020b18]" />
                  )}
                </div>
                <span className="text-sm font-semibold" style={{ color: data.monthlyIncome === opt.key ? '#00f5ff' : 'var(--text-muted)' }}>
                  Rp {opt.label} / bulan
                </span>
              </button>
            ))}
          </div>
        </div>

        
        {data.monthlyIncome && (
          <div
            className="p-4 rounded-xl flex items-center gap-4"
            style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.1)' }}
          >
            <TrendingUp size={18} style={{ color: '#00f5ff' }} />
            <div>
              <div className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--text-dim)' }}>
                Pendapatan Terpilih
              </div>
              <div className="text-sm font-bold font-mono" style={{ color: '#00f5ff' }}>
                Rp {INCOME_OPTIONS.find(o => o.key === data.monthlyIncome)?.label} / bulan
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
