import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, KeyRound, Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import api from '../../lib/api'

// Debounce helper
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

export function StepContact({ data, setData, canNext, setCanNext }) {
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [checkingPhone, setCheckingPhone] = useState(false)
  const [emailStatus, setEmailStatus] = useState(null) 
  const [phoneStatus, setPhoneStatus] = useState(null)

  const debouncedEmail = useDebounce(data.email, 800)
  const debouncedPhone = useDebounce(data.phone, 800)


  useEffect(() => {
    if (!debouncedEmail || !debouncedEmail.includes('@')) {
      setEmailStatus(null)
      return
    }

    const checkEmail = async () => {
      setCheckingEmail(true)
      setEmailStatus('checking')
      try {
        const res = await api.post('/auth/check-availability', { email: debouncedEmail })
        if (res.data.email.available) {
          setEmailStatus('available')
        } else {
          setEmailStatus('taken')
        }
      } catch (err) {
        setEmailStatus(null)
      } finally {
        setCheckingEmail(false)
      }
    }

    checkEmail()
  }, [debouncedEmail])

  useEffect(() => {
    if (!debouncedPhone || debouncedPhone.length < 8) {
      setPhoneStatus(null)
      return
    }

    const checkPhone = async () => {
      setCheckingPhone(true)
      setPhoneStatus('checking')
      try {
        const res = await api.post('/auth/check-availability', { phone: debouncedPhone })
        if (res.data.phone.available) {
          setPhoneStatus('available')
        } else {
          setPhoneStatus('taken')
        }
      } catch (err) {
        setPhoneStatus(null)
      } finally {
        setCheckingPhone(false)
      }
    }

    checkPhone()
  }, [debouncedPhone])

  useEffect(() => {
    const emailValid = data.email && data.email.includes('@')
    const phoneValid = data.phone && data.phone.length >= 8
    const passValid = data.password && data.password.length >= 8
    const confirmValid = data.confirmPassword && data.password === data.confirmPassword
    const emailAvailable = emailStatus !== 'taken'
    const phoneAvailable = phoneStatus !== 'taken'
    const notChecking = emailStatus !== 'checking' && phoneStatus !== 'checking'

    const isValid = emailValid && phoneValid && passValid && confirmValid && emailAvailable && phoneAvailable && notChecking

    if (setCanNext) {
      setCanNext(isValid)
    }
  }, [data, emailStatus, phoneStatus, setCanNext])

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
              className="finput pr-10"
              style={emailStatus === 'taken' ? { borderColor: '#ff4d6a' } : emailStatus === 'available' ? { borderColor: '#10b981' } : {}}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {checkingEmail ? (
                <Loader2 size={16} className="animate-spin" style={{ color: 'var(--text-dim)' }} />
              ) : emailStatus === 'available' ? (
                <CheckCircle size={16} style={{ color: '#10b981' }} />
              ) : emailStatus === 'taken' ? (
                <XCircle size={16} style={{ color: '#ff4d6a' }} />
              ) : null}
            </div>
          </div>
          {emailStatus === 'taken' && (
            <p className="text-xs mt-1" style={{ color: '#ff4d6a' }}>
              Email sudah terdaftar. Gunakan email lain.
            </p>
          )}
          {emailStatus === 'available' && (
            <p className="text-xs mt-1" style={{ color: '#10b981' }}>
              Email tersedia.
            </p>
          )}
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
              className="finput pr-10"
              style={phoneStatus === 'taken' ? { borderColor: '#ff4d6a' } : phoneStatus === 'available' ? { borderColor: '#10b981' } : {}}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {checkingPhone ? (
                <Loader2 size={16} className="animate-spin" style={{ color: 'var(--text-dim)' }} />
              ) : phoneStatus === 'available' ? (
                <CheckCircle size={16} style={{ color: '#10b981' }} />
              ) : phoneStatus === 'taken' ? (
                <XCircle size={16} style={{ color: '#ff4d6a' }} />
              ) : null}
            </div>
          </div>
          {phoneStatus === 'taken' && (
            <p className="text-xs mt-1" style={{ color: '#ff4d6a' }}>
              Nomor telepon sudah terdaftar. Gunakan nomor lain.
            </p>
          )}
          {phoneStatus === 'available' && (
            <p className="text-xs mt-1" style={{ color: '#10b981' }}>
              Nomor telepon tersedia.
            </p>
          )}
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
              style={data.confirmPassword && data.password !== data.confirmPassword ? { borderColor: '#ff4d6a' } : data.confirmPassword && data.password === data.confirmPassword ? { borderColor: '#10b981' } : {}}
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
