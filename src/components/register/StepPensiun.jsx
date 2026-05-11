import { motion } from 'framer-motion'
import { Zap, Brain } from 'lucide-react'

// ============================================================
// STEP 5: PENSIUN
// Form input target usia pensiun
// ============================================================
export function StepPensiun({ data, setData }) {
  const today = new Date()
  const yearsLeft = () => today.getFullYear() + (data.retirementAge || 55) - today.getFullYear()

  return (
    <motion.div
      key="steppension"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6"
    >
      
      <div>
        <div className="section-label">Step 5 of 5</div>
        <h2 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
          Target Usia <span className="grad-text">Pensiun</span>
        </h2>
        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
          Kapan kamu ingin berhenti bekerja dan menikmati hasilnya? Ini penting untuk kalkulasi pensiunmu.
        </p>
      </div>

      
      <div className="flex flex-col gap-5">
        
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
            Target Usia Pensiun
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="45"
              max="70"
              value={data.retirementAge || 55}
              onChange={e => setData(d => ({ ...d, retirementAge: parseInt(e.target.value) }))}
              style={{ flex: 1 }}
            />
            <div className="font-mono font-extrabold text-2xl w-14 text-right" style={{ color: '#00f5ff' }}>
              {data.retirementAge || 55}
            </div>
          </div>
          <div className="flex justify-between" style={{ color: 'var(--text-dim)' }}>
            <span className="text-xs">45 tahun</span>
            <span className="text-xs">70 tahun</span>
          </div>
        </div>

        
        <div
          className="relative overflow-hidden rounded-2xl p-6 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(0,245,255,0.08) 0%, rgba(0,180,216,0.05) 100%)', border: '1px solid rgba(0,245,255,0.2)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 0%, rgba(0,245,255,0.1) 0%, transparent 60%)' }}
          />
          <div className="relative z-10">
            <Zap size={28} className="mx-auto mb-3" style={{ color: '#00f5ff' }} />
            <div className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--text-dim)' }}>
              Target Pensiun
            </div>
            <div className="text-5xl font-extrabold font-mono tracking-tight" style={{ color: '#00f5ff' }}>
              {data.retirementAge || 55}
            </div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>tahun</div>
            <div
              className="mt-3 text-xs px-3 py-1.5 rounded-full inline-block"
              style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)', color: 'var(--text-muted)' }}
            >
              {yearsLeft()} tahun lagi menuju kebebasan finansial
            </div>
          </div>
        </div>

        
        <div
          className="flex items-start gap-2 p-3 rounded-xl"
          style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.1)' }}
        >
          <Brain size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#ffd700' }} />
          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            AI FinTime akan menghitung kombinasi terbaik antara tabungan, investasi, dan compound interest agar kamu bisa pensiun di usia yang kamu inginkan.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
