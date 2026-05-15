import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ChevronLeft, Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, KeyRound, ArrowRight
} from 'lucide-react'
import ParticleField from '../components/Particlefield'
import api from '../lib/api'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [tokenValid, setTokenValid] = useState(null)

  useEffect(() => {
    if (!token) {
      setTokenValid(false)
      return
    }
    setTokenValid(true)
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password minimal 8 karakter')
      return
    }

    if (password !== confirmPassword) {
      setError('Password tidak cocok')
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/reset-password', { token, newPassword: password })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Token mungkin sudah kadaluwarsa.')
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = () => {
    if (password.length === 0) return { label: '', color: '', percent: 0 }
    if (password.length < 8) return { label: 'Lemah', color: '#f87171', percent: 33 }
    if (password.length < 12) return { label: 'Sedang', color: '#fbbf24', percent: 66 }
    return { label: 'Kuat', color: '#22c55e', percent: 100 }
  }

  const strength = getPasswordStrength()

  return (
    <div className="relative min-h-screen min-h-[100dvh] flex overflow-hidden" style={{ background: 'var(--dark)' }}>
      <ParticleField count={50} />

      {/* Left Panel - Branding */}
      <div
        className="hidden lg:flex flex-col items-center justify-center relative"
        style={{
          background: 'linear-gradient(135deg, #061528 0%, #020b18 50%, #0a1f35 100%)',
          flex: '0 0 45%',
          padding: 'clamp(2rem, 5vw, 4rem)',
        }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 400, height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,245,255,0.1) 0%, transparent 70%)',
            top: '-20%', right: '-15%',
            animation: 'breathe 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 300, height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)',
            bottom: '-10%', left: '-10%',
            animation: 'breathe 10s ease-in-out infinite reverse',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center text-center gap-8"
        >
          {/* Logo */}
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-2xl border-2 flex items-center justify-center"
              style={{
                borderColor: 'rgba(0,245,255,0.4)',
                boxShadow: '0 0 60px rgba(0,245,255,0.2), inset 0 0 30px rgba(0,245,255,0.1)',
                background: 'rgba(0,245,255,0.05)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span className="text-4xl">⏱</span>
            </motion.div>
            <div className="flex flex-col items-center">
              <span
                className="text-6xl font-black tracking-tighter"
                style={{
                  background: 'linear-gradient(135deg, #00f5ff, #0096c7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Sora, sans-serif',
                }}
              >
                FinTime
              </span>
              <span
                className="text-xs font-mono px-4 py-1.5 rounded-full mt-3 tracking-[0.2em] uppercase"
                style={{
                  background: 'rgba(0,245,255,0.08)',
                  border: '1px solid rgba(0,245,255,0.2)',
                  color: 'rgba(0,245,255,0.8)',
                }}
              >
                AI Powering Future
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="mt-4">
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight" style={{ color: 'var(--text)' }}>
              Atur Ulang Password
            </h2>
            <p className="text-base mt-4 max-w-sm" style={{ color: 'var(--text-muted)' }}>
              Buat password baru yang kuat untuk mengamankan akun FinTime Anda.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-4 w-full max-w-sm mt-2">
            {[
              { icon: Lock, title: 'Min. 8 Karakter', desc: 'Password harus kuat' },
              { icon: KeyRound, title: 'Token Valid', desc: 'Terverifikasi sistem' },
              { icon: CheckCircle, title: 'Aman & Terenkripsi', desc: 'Data Anda terlindungi' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{
                  background: 'rgba(0,245,255,0.03)',
                  border: '1px solid rgba(0,245,255,0.08)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,245,255,0.1)' }}>
                  <item.icon size={22} style={{ color: '#00f5ff' }} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold" style={{ color: '#00f5ff' }}>{item.title}</div>
                  <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {/* Token Invalid State */}
            {tokenValid === false && (
              <motion.div
                key="invalid"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(248, 113, 113, 0.2), rgba(248, 113, 113, 0.1))',
                    border: '2px solid rgba(248, 113, 113, 0.4)',
                    boxShadow: '0 0 60px rgba(248, 113, 113, 0.2)',
                  }}
                >
                  <AlertCircle size={48} style={{ color: '#f87171' }} />
                </motion.div>

                <h2 className="text-3xl font-extrabold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
                  <span style={{ color: '#f87171' }}>Link Invalid</span>
                </h2>

                <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
                  Link reset password tidak valid atau sudah kedaluwarsa.<br />
                  Silakan minta link baru.
                </p>

                <Link to="/forgot-password" className="btn-primary inline-flex items-center gap-3 px-8 py-4 text-base font-extrabold rounded-xl">
                  <KeyRound size={20} />
                  <span>Minta Link Baru</span>
                </Link>
              </motion.div>
            )}

            {/* Success State */}
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))',
                    border: '2px solid rgba(34, 197, 94, 0.4)',
                    boxShadow: '0 0 60px rgba(34, 197, 94, 0.2)',
                  }}
                >
                  <CheckCircle size={48} style={{ color: '#22c55e' }} />
                </motion.div>

                <h2 className="text-3xl font-extrabold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
                  <span className="grad-text">Password Berhasil!</span>
                </h2>

                <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
                  Password akun FinTime Anda berhasil direset.<br />
                  Silakan login dengan password baru.
                </p>

                <Link to="/login" className="btn-primary inline-flex items-center gap-3 px-8 py-4 text-base font-extrabold rounded-xl">
                  <span>Masuk Sekarang</span>
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            )}

            {/* Form Reset Password */}
            {tokenValid === true && !success && (
              <motion.div
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Back Link */}
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-colors hover:text-cyan-400"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <ChevronLeft size={16} />
                  Kembali ke halaman masuk
                </Link>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)' }}
                  >
                    <Lock size={22} style={{ color: '#00f5ff' }} />
                  </div>
                  <span
                    className="text-2xl font-bold tracking-tight"
                    style={{
                      background: 'linear-gradient(135deg, #00f5ff, #0096c7)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    FinTime
                  </span>
                </div>

                <div className="section-label">Create New Password</div>
                <h1 className="text-4xl font-extrabold mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Buat Password <span className="grad-text">Baru</span>
                </h1>
                <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
                  Masukkan password baru yang kuat dan mudah diingat.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Password baru */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
                      Password Baru <span style={{ color: '#00f5ff' }}>*</span>
                    </label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimal 8 karakter"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="finput pl-12 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-cyan-400"
                        style={{ color: 'var(--text-dim)' }}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    {/* Password strength */}
                    {password.length > 0 && (
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,245,255,0.1)' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${strength.percent}%` }}
                            className="h-full rounded-full"
                            style={{ background: strength.color }}
                          />
                        </div>
                        <span className="text-xs font-bold min-w-[50px]" style={{ color: strength.color }}>
                          {strength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Konfirmasi password */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
                      Konfirmasi Password <span style={{ color: '#00f5ff' }}>*</span>
                    </label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Masukkan ulang password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="finput pl-12 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-cyan-400"
                        style={{ color: 'var(--text-dim)' }}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    {/* Match indicator */}
                    {confirmPassword.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mt-2"
                      >
                        {password === confirmPassword ? (
                          <span className="text-xs font-bold flex items-center gap-2" style={{ color: '#22c55e' }}>
                            <CheckCircle size={14} />
                            Password cocok
                          </span>
                        ) : (
                          <span className="text-xs font-bold flex items-center gap-2" style={{ color: '#f87171' }}>
                            <AlertCircle size={14} />
                            Password tidak cocok
                          </span>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 rounded-xl"
                      style={{
                        background: 'rgba(248, 113, 113, 0.1)',
                        border: '1px solid rgba(248, 113, 113, 0.3)',
                      }}
                    >
                      <AlertCircle size={18} style={{ color: '#f87171' }} />
                      <span className="text-sm" style={{ color: '#f87171' }}>{error}</span>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full flex items-center justify-center gap-3 px-6 py-4 text-base font-extrabold rounded-xl"
                    disabled={loading || password !== confirmPassword || password.length < 8}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Mereset password...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={20} />
                        <span>Reset Password</span>
                        <ArrowRight size={20} />
                      </>
                    )}
                  </motion.button>
                </form>

                <p className="text-center text-sm mt-8" style={{ color: 'var(--text-muted)' }}>
                  Ingat password Anda?{' '}
                  <Link to="/login" className="font-bold transition-colors hover:text-cyan-400" style={{ color: '#00f5ff' }}>
                    Masuk di sini
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}