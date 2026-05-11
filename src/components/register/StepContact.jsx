import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, KeyRound, Lock, Eye, EyeOff } from 'lucide-react'

// ============================================================
// STEP 2: KONTAK
// Form input email, telepon, password & konfirmasi password
// ============================================================
export function StepContact({ data, setData }) {
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6"
    >
      
      <div>
        <div className="section-label">Step 2 of 5</div>
        <h2 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
          Bagaimana <span className="grad-text">Bisa Dihubungi?</span>
        </h2>
        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
          Kami butuh cara untuk menghampiri kamu. Semua data dijaga kerahasiaannya.
        </p>
      </div>

      
      <div className="flex flex-col gap-5">
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
            Alamat Email <span style={{ color: '#00f5ff' }}>*</span>
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-dim)' }} />
            <input
              type="email"
              placeholder="nama@email.com"
              value={data.email}
              onChange={e => setData(d => ({ ...d, email: e.target.value }))}
              className="finput"
            />
          </div>
        </div>

        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
            Nomor Telepon <span style={{ color: '#00f5ff' }}>*</span>
          </label>
          <div className="relative">
            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-dim)' }} />
            <input
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={data.phone}
              onChange={e => setData(d => ({ ...d, phone: e.target.value }))}
              className="finput"
            />
          </div>
        </div>

        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
            Kata Sandi <span style={{ color: '#00f5ff' }}>*</span>
          </label>
          <div className="relative">
            <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-dim)' }} />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Minimal 8 karakter"
              value={data.password || ''}
              onChange={e => setData(d => ({ ...d, password: e.target.value }))}
              className="finput pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-dim)' }}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
            Konfirmasi Kata Sandi <span style={{ color: '#00f5ff' }}>*</span>
          </label>
          <div className="relative">
            <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-dim)' }} />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Masukkan ulang kata sandi"
              value={data.confirmPassword || ''}
              onChange={e => setData(d => ({ ...d, confirmPassword: e.target.value }))}
              className="finput pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-dim)' }}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {data.confirmPassword && data.password !== data.confirmPassword && (
            <p className="text-xs mt-1" style={{ color: '#ff4d6a' }}>
              Kata sandi tidak cocok. Pastikan kedua kata sandi sama.
            </p>
          )}
        </div>

        
        <div
          className="flex items-start gap-3 p-4 rounded-xl"
          style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.1)' }}
        >
          <Lock size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#00f5ff' }} />
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            Data pribadimu dienkripsi dan hanya digunakan untuk notifikasi penting. Kami menjamin keamanan data 100%.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
