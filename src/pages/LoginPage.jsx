import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Eye, EyeOff, Loader2, LogIn,
  TrendingUp, Bot, Target, Shield,
  ChevronLeft, Mail, Lock
} from 'lucide-react'
import ParticleField from '../components/Particlefield'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="relative min-h-screen flex overflow-hidden" style={{ background: 'var(--dark)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <ParticleField count={40} />
      </div>

      <div
        className="hidden lg:flex flex-col items-center justify-center relative"
        style={{
          background: 'linear-gradient(135deg, #061528 0%, #020b18 50%, #0a1f35 100%)',
          flex: '0 0 45%',
          padding: 'clamp(2rem, 5vw, 4rem)',
          overflow: 'hidden',
        }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            width: 300, height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%)',
            top: '10%', right: '-10%',
            animation: 'breathe 6s ease-in-out infinite',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 200, height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,180,216,0.06) 0%, transparent 70%)',
            bottom: '20%', left: '-5%',
            animation: 'breathe 8s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 flex flex-col items-center text-center gap-6"
        >
          <div className="flex flex-col items-center gap-4 mb-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-full border-2 border-cyan-DEFAULT/40 flex items-center justify-center text-2xl"
              style={{
                borderColor: 'rgba(0,245,255,0.3)',
                boxShadow: '0 0 40px rgba(0,245,255,0.15)',
                background: 'rgba(0,245,255,0.05)'
              }}
            >
              <span className="text-3xl">⏱</span>
            </motion.div>
            <div className="flex flex-col items-center">
              <span
                className="text-5xl font-black tracking-tighter"
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
                className="text-[10px] font-mono px-3 py-1 rounded-full mt-2 tracking-[0.2em] uppercase"
                style={{
                  background: 'rgba(0,245,255,0.08)',
                  border: '1px solid rgba(0,245,255,0.15)',
                  color: 'rgba(0,245,255,0.7)',
                }}
              >
                AI Powering Future
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              <span style={{ color: 'var(--text)' }}>Selamat Datang</span>
              <br />
              <span className="shimmer-text">Kembali</span>
            </h2>
            <p className="text-sm mt-4 max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Lanjutkan perjalanan finansialmu dan lihat bagaimana AI kami memproyeksikan masa depanmu.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-2">
            {[
              { icon: TrendingUp, value: '4.2M+', label: 'Proyeksi Dihasilkan' },
              { icon: Bot, value: 'AI Powered', label: 'NLP Engine' },
              { icon: Target, value: '98%', label: 'Akurasi Model' },
              { icon: Shield, value: '256-bit', label: 'Enkripsi' },
            ].map(stat => (
              <div
                key={stat.label}
                className="p-3 rounded-xl text-center"
                style={{
                  background: 'rgba(0,245,255,0.04)',
                  border: '1px solid rgba(0,245,255,0.1)',
                }}
              >
                <div className="mb-1 flex justify-center"><stat.icon size={20} style={{ color: '#00f5ff' }} /></div>
                <div className="text-sm font-bold font-mono" style={{ color: '#00f5ff' }}>{stat.value}</div>
                <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div
        className="flex-1 flex flex-col justify-center relative z-10"
        style={{ padding: 'clamp(2rem, 5vw, 4rem)' }}
      >
        <Link
          to="/"
          className="absolute top-6 right-6 flex items-center gap-1.5 text-sm font-semibold no-underline"
          style={{ color: 'var(--text-muted)', fontFamily: 'Sora, sans-serif' }}
        >
          <ChevronLeft size={14} /> Kembali
        </Link>

        <div className="w-full max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 rounded-full border border-cyan-DEFAULT/40 flex items-center justify-center text-sm"
                style={{ borderColor: 'rgba(0,245,255,0.4)' }}
              >
                ⏱
              </motion.div>
              <span
                className="text-xl font-bold tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #00f5ff, #0096c7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Sora, sans-serif',
                  letterSpacing: '-0.03em',
                }}
              >
                FinTime
              </span>
            </div>
            <div className="section-label">Welcome Back</div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
              Masuk ke <span className="grad-text">FinTime</span>
            </h2>
            <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
              Belum punya akun?{' '}
              <Link to="/register" className="font-bold no-underline" style={{ color: '#00f5ff' }}>
                Daftar di sini
              </Link>
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
                  Email <span style={{ color: '#00f5ff' }}>*</span>
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="finput"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
                  Password <span style={{ color: '#00f5ff' }}>*</span>
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="finput pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-dim)' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#00f5ff]" />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Ingat saya</span>
                </label>
                <button
                  type="button"
                  className="text-xs font-bold no-underline"
                  style={{ color: '#00f5ff' }}
                >
                  Lupa password?
                </button>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-base font-extrabold rounded-full mt-2"
                style={{ cursor: 'pointer' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Memuat...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Masuk</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
