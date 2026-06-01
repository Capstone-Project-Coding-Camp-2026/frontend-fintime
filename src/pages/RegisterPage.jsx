import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Clock,
} from 'lucide-react'

import ParticleField from '../components/Particlefield'
import api from '../lib/api'
import { useToast } from '../context/ToastContext'
import {
  StepCheckpoint,
  StepPersonal,
  StepContact,
  StepFinancial,
  StepBankEWallet,
  StepPensiun,
  RegisterSuccess,
  RegisterLeftPanel,
  STEPS,
  INITIAL_FORM_DATA,
} from '../components/register'

export default function RegisterPage() {
  // â”€â”€â”€ State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const { success, error: showError } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [step2CanNext, setStep2CanNext] = useState(false) // Untuk StepContact
  const navigate = useNavigate()

  // â”€â”€â”€ OTP State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [showOtp, setShowOtp] = useState(false)
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [otpCountdown, setOtpCountdown] = useState(0)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const otpRefs = useRef([])

  // OTP Countdown timer
  useEffect(() => {
    if (otpCountdown <= 0) return
    const timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [otpCountdown])

  // â”€â”€â”€ Validasi step â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const canNext = () => {
    if (currentStep === 0) {
      return (
        formData.fullName &&
        formData.gender &&
        formData.birthDate &&
        formData.jobType
      )
    }
    if (currentStep === 1) {
      return step2CanNext
    }
    if (currentStep === 2) {
      return formData.monthlyIncome
    }
    return true
  }

  const handleNext = async () => {
    if (!canNext()) return
    setError('')

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      setIsLoading(true)
      try {
        // 1. Kirim OTP ke email user (TIDAK register dulu)
        setRegisteredEmail(formData.email)
        await api.post('/mock/send-otp', { email: formData.email })

        // 2. Tampilkan layar OTP
        setShowOtp(true)
        setOtpCountdown(60)
        setOtpValues(['', '', '', '', '', ''])
      } catch (err) {
        console.error('OTP send error:', err)
        setError(
          err.response?.data?.message || 'Gagal mengirim OTP. Pastikan email Anda valid.'
        )
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1)
  }

  // Reset step2CanNext saat kembali ke step lain
  const handleBackReset = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
      if (currentStep === 1) {
        setStep2CanNext(false)
      }
    }
  }

  // â”€â”€â”€ Progress calculation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const progressPct = (currentStep / (STEPS.length - 1)) * 100

  // â”€â”€â”€ OTP Handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otpValues]
    newOtp[index] = value
    setOtpValues(newOtp)
    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
    if (pasted.length === 6) {
      setOtpValues(pasted.split(''))
      otpRefs.current[5]?.focus()
    }
  }

  const handleResendOtp = async () => {
    if (otpCountdown > 0) return
    try {
      await api.post('/mock/send-otp', { email: registeredEmail })
      setOtpCountdown(60)
      setOtpValues(['', '', '', '', '', ''])
      setOtpError('')
      success('Kode OTP baru telah berhasil dikirim ulang ke email Anda!')
    } catch (err) {
      console.error('Resend OTP failed:', err)
      showError(err.response?.data?.message || 'Gagal mengirim ulang OTP.')
    }
  }

  const handleVerifyOtp = async () => {
    const otpCode = otpValues.join('')
    if (otpCode.length !== 6) {
      setOtpError('Masukkan 6 digit kode OTP')
      return
    }
    setOtpLoading(true)
    setOtpError('')
    try {
      // Panggil Register DAN Verify OTP sekaligus
      await api.post('/auth/register', {
        ...formData,
        otp: otpCode,
      })
      // Berhasil mendaftar, tapi TIDAK otomatis login
      setShowOtp(false)
      setIsSuccess(true)
    } catch (err) {
      console.error('Register/OTP verify failed:', err)
      setOtpError(
        err.response?.data?.message ||
          'Kode OTP tidak valid atau pendaftaran gagal.',
      )
    } finally {
      setOtpLoading(false)
    }
  }

  // â”€â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div
      className="relative min-h-screen min-h-[100dvh] flex overflow-hidden"
      style={{ background: 'var(--dark)' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <ParticleField count={40} />
      </div>

      <RegisterLeftPanel />

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
          <div className="flex items-center gap-2 mb-6">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 rounded-full border border-cyan-DEFAULT/40 flex items-center justify-center text-sm"
              style={{ borderColor: 'rgba(0,245,255,0.4)' }}
            >
              <Clock size={16} color="#00f5ff" />
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

          {!isSuccess && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-mono font-bold tracking-widest"
                  style={{ color: 'var(--text-dim)' }}
                >
                  {Math.round(progressPct)}% COMPLETE
                </span>
                <span
                  className="text-xs font-mono"
                  style={{ color: 'var(--text-dim)' }}
                >
                  {currentStep + 1} / {STEPS.length}
                </span>
              </div>
              <div
                className="h-0.5 rounded-full overflow-hidden"
                style={{ background: 'rgba(0,245,255,0.1)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.45 }}
                  style={{
                    background: 'linear-gradient(90deg, #0096c7, #00f5ff)',
                    boxShadow: '0 0 8px rgba(0,245,255,0.5)',
                  }}
                />
              </div>
              <div className="flex justify-between mt-4">
                {STEPS.map((_, i) => (
                  <StepCheckpoint key={i} step={i} current={currentStep} />
                ))}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <RegisterSuccess key="success" data={formData} />
            ) : showOtp ? (
              <motion.div
                key="otp-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center text-center gap-5 py-4"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(0,245,255,0.1)',
                    border: '2px solid rgba(0,245,255,0.4)',
                    boxShadow: '0 0 30px rgba(0,245,255,0.2)',
                  }}
                >
                  <ShieldCheck size={32} style={{ color: '#00f5ff' }} />
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight mb-1">
                    Verifikasi <span className="grad-text">OTP</span>
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Kode verifikasi telah dikirim ke
                  </p>
                  <p className="text-sm font-bold" style={{ color: '#00f5ff' }}>
                    {registeredEmail}
                  </p>
                </div>

                {/* OTP Inputs */}
                <div
                  className="flex gap-3 justify-center"
                  onPaste={handleOtpPaste}
                >
                  {otpValues.map((val, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 rounded-xl text-center text-xl font-bold outline-none transition-all"
                      style={{
                        background: val
                          ? 'rgba(0,245,255,0.1)'
                          : 'rgba(0,245,255,0.04)',
                        border: `2px solid ${val ? 'rgba(0,245,255,0.5)' : 'rgba(0,245,255,0.12)'}`,
                        color: '#00f5ff',
                        caretColor: '#00f5ff',
                      }}
                    />
                  ))}
                </div>

                {/* OTP Error */}
                {otpError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl text-sm w-full"
                    style={{
                      backgroundColor: 'rgba(248, 113, 113, 0.1)',
                      border: '1px solid rgba(248, 113, 113, 0.3)',
                      color: '#f87171',
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{otpError}</span>
                  </motion.div>
                )}

                {/* Verify Button */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleVerifyOtp}
                  disabled={otpLoading || otpValues.join('').length !== 6}
                  className="btn-primary w-full flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-extrabold rounded-full"
                  style={{
                    opacity:
                      otpLoading || otpValues.join('').length !== 6 ? 0.5 : 1,
                    cursor:
                      otpLoading || otpValues.join('').length !== 6
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                >
                  {otpLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />{' '}
                      Memverifikasi...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} /> Verifikasi OTP
                    </>
                  )}
                </motion.button>

                {/* Resend */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResendOtp}
                    disabled={otpCountdown > 0}
                    className="flex items-center gap-1.5 text-xs font-semibold transition-all"
                    style={{
                      color: otpCountdown > 0 ? 'var(--text-dim)' : '#00f5ff',
                      cursor: otpCountdown > 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <RefreshCw size={12} />
                    {otpCountdown > 0
                      ? `Kirim ulang dalam ${otpCountdown}s`
                      : 'Kirim Ulang OTP'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                {currentStep === 0 && (
                  <StepPersonal data={formData} setData={setFormData} />
                )}
                {currentStep === 1 && (
                  <StepContact
                    data={formData}
                    setData={setFormData}
                    canNext={step2CanNext}
                    setCanNext={setStep2CanNext}
                  />
                )}
                {currentStep === 2 && (
                  <StepFinancial data={formData} setData={setFormData} />
                )}
                {currentStep === 3 && (
                  <StepBankEWallet data={formData} setData={setFormData} />
                )}
                {currentStep === 4 && (
                  <StepPensiun data={formData} setData={setFormData} />
                )}
              </>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl text-sm mt-4"
              style={{
                backgroundColor: 'rgba(248, 113, 113, 0.1)',
                border: '1px solid rgba(248, 113, 113, 0.3)',
                color: '#f87171',
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}

          {!isSuccess && !showOtp && (
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={handleBackReset}
                className="btn-ghost text-sm font-bold px-6 py-3"
                style={{ visibility: currentStep > 0 ? 'visible' : 'hidden' }}
              >
                <ChevronLeft size={14} className="inline mr-1" /> Kembali
              </button>

              <motion.button
                whileHover={{ scale: canNext() && !isLoading ? 1.04 : 1 }}
                whileTap={{ scale: canNext() && !isLoading ? 0.97 : 1 }}
                onClick={handleNext}
                disabled={!canNext() || isLoading}
                className="btn-primary flex items-center gap-2 px-7 py-3 text-sm font-extrabold rounded-full"
                style={{
                  opacity: canNext() && !isLoading ? 1 : 0.4,
                  cursor: canNext() && !isLoading ? 'pointer' : 'not-allowed',
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    {currentStep === 4 ? 'Buat Akun' : 'Lanjut'}
                    <ArrowRight size={14} />
                  </>
                )}
              </motion.button>
            </div>
          )}

          {!isSuccess && !showOtp && (
            <p
              className="text-center text-xs mt-6"
              style={{ color: 'var(--text-dim)' }}
            >
              Sudah punya akun?{' '}
              <Link
                to="/login"
                className="font-bold no-underline"
                style={{ color: '#00f5ff' }}
              >
                Masuk di sini
              </Link>
            </p>
          )}

          {isSuccess && (
            <div className="flex flex-col gap-3 mt-6">
              <Link
                to="/login"
                className="btn-primary flex items-center justify-center gap-2 px-6 py-3 text-sm font-extrabold rounded-full no-underline"
              >
                Lanjut ke Halaman Login <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

