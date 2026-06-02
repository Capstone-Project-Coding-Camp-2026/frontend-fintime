import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ChevronLeft, Mail, Loader2, CheckCircle, AlertCircle,
  KeyRound, Shield, Clock, ArrowRight, Timer
} from 'lucide-react'
import ParticleField from '../components/Particlefield'
import api from '../lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/auth/forgot-password', { email })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

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
              <Timer size={40} color="#00f5ff" />
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
              Lupa Password?
            </h2>
            <p className="text-base mt-4 max-w-sm" style={{ color: 'var(--text-muted)' }}>
              Tenang, kami akan bantu Anda mendapatkan akses kembali ke akun FinTime Anda dengan mudah.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-4 w-full max-w-sm mt-2">
            {[
              { icon: KeyRound, title: 'Link Reset', desc: 'Dikirim langsung ke email' },
              { icon: Clock, title: 'Berlaku 1 Jam', desc: 'Aman dari penyalahgunaan' },
              { icon: Shield, title: 'Enkripsi Token', desc: 'Data Anda terlindungi' },
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
      <div
        className="flex-1 flex flex-col justify-center items-center relative z-10 p-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
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
                    <KeyRound size={22} style={{ color: '#00f5ff' }} />
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

                <div className="section-label">Account Recovery</div>
                <h1 className="text-4xl font-extrabold mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Atur Ulang <span className="grad-text">Password</span>
                </h1>
                <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
                  Masukkan alamat email yang terhubung dengan akun FinTime Anda.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
                      Alamat Email <span style={{ color: '#00f5ff' }}>*</span>
                    </label>
                    <div className="relative">
                      <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
                      <input
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="finput pl-12"
                        required
                      />
                    </div>
                  </div>

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
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Mengirim link...</span>
                      </>
                    ) : (
                      <>
                        <Mail size={20} />
                        <span>Kirim Link Reset</span>
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
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {/* Success Icon */}
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
                  <span className="grad-text">Link Terkirim!</span>
                </h2>

                <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
                  Kami telah mengirim link reset password ke:<br />
                  <span className="font-bold text-lg" style={{ color: '#00f5ff' }}>{email}</span>
                </p>

                {/* Steps */}
                <div
                  className="p-6 rounded-2xl mb-8 text-left"
                  style={{
                    background: 'rgba(0,245,255,0.03)',
                    border: '1px solid rgba(0,245,255,0.1)',
                  }}
                >
                  <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--text-muted)' }}>Langkah selanjutnya:</h4>
                  <div className="space-y-3">
                    {[
                      'Cek inbox email Anda',
                      'Klik link "Reset Password"',
                      'Buat password baru yang kuat',
                    ].map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(0,245,255,0.2)', color: '#00f5ff' }}>
                          {index + 1}
                        </div>
                        <span className="text-sm" style={{ color: 'var(--text)' }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-sm mb-6" style={{ color: 'var(--text-dim)' }}>
                  Tidak menerima email? Cek folder{' '}
                  <span className="font-bold" style={{ color: '#00f5ff' }}>Spam</span> atau{' '}
                  <button
                    onClick={() => {
                      setSuccess(false)
                      setEmail('')
                      setError('')
                    }}
                    className="font-bold transition-colors hover:text-cyan-400"
                    style={{ color: '#00f5ff' }}
                  >
                    coba lagi
                  </button>
                </p>

                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
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