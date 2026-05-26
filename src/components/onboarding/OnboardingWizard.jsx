import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, Check, Rocket, Target, PieChart, Zap, TrendingUp, Shield } from 'lucide-react'

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Selamat Datang di FinTime!',
    description: 'Aplikasi AI Financial Time Machine yang membantu Anda mencapai kebebasan finansial.',
    icon: Rocket,
    color: '#00f5ff',
    features: [
      'Analisis kesehatan keuangan dengan avatar AI',
      'Simulasi "What-If" untuk keputusan pembelian',
      'Proyeksi kekayaan dan dana pensiun',
    ],
  },
  {
    id: 'dashboard',
    title: 'Dashboard Interaktif',
    description: 'Pantau semua aktivitas keuangan Anda dalam satu tampilan.',
    icon: PieChart,
    color: '#a855f7',
    features: [
      'Overview saldo dan proyeksi kekayaan',
      'Quick actions untuk tambah transaksi',
      'Smart Ledger untuk labeling otomatis',
    ],
  },
  {
    id: 'budget',
    title: 'Budgeting Cerdas',
    description: 'Atur limit pengeluaran per kategori dan tetap dalam kendali.',
    icon: Target,
    color: '#fbbf24',
    features: [
      'Buat budget bulanan per kategori',
      'Peringatan saat mendekati limit',
      'Tracking progress secara real-time',
    ],
  },
  {
    id: 'goals',
    title: 'Target Tabungan',
    description: 'Tetapkan dan capai tujuan keuangan Anda.',
    icon: TrendingUp,
    color: '#22c55e',
    features: [
      'Multiple goals dengan deadline',
      'Progress tracking visual',
      'Notifikasi jatuh tempo',
    ],
  },
  {
    id: 'ai',
    title: 'AI Assistance',
    description: 'Dapatkan rekomendasi keuangan berdasarkan data Anda.',
    icon: Zap,
    color: '#ec4899',
    features: [
      'Forecast kekayaan masa depan',
      'Analisis keputusan pembelian',
      'Relabeling transaksi otomatis',
    ],
  },
  {
    id: 'complete',
    title: 'Semua Siap!',
    description: 'Anda siap memulai perjalanan keuangan yang lebih baik.',
    icon: Shield,
    color: '#06b6d4',
    features: [],
  },
]

export default function OnboardingWizard({ onComplete, showOnboarding = false }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (showOnboarding) {
      setIsVisible(true)
      setCurrentStep(0)
      return
    }

    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('fintime_onboarding_complete')
    if (!hasSeenOnboarding) {
      setIsVisible(true)
    }
  }, [showOnboarding])

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    localStorage.setItem('fintime_onboarding_complete', 'true')
    setIsVisible(false)
    if (onComplete) onComplete()
  }

  if (!isVisible) return null

  const step = ONBOARDING_STEPS[currentStep]
  const StepIcon = step.icon
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{ background: 'rgba(2,11,24,0.95)' }}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-lg rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(6,21,40,0.95) 0%, rgba(2,11,24,0.98) 100%)',
            border: '1px solid rgba(0,245,255,0.2)',
            boxShadow: '0 0 60px rgba(0,245,255,0.15), 0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10 z-10"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <X size={18} />
          </button>

          {/* Progress Bar */}
          <div className="h-1" style={{ background: 'rgba(0,245,255,0.1)' }}>
            <motion.div
              className="h-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
              style={{ background: step.color }}
            />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Icon */}
            <motion.div
              key={currentStep}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{
                background: `${step.color}15`,
                border: `2px solid ${step.color}40`,
                boxShadow: `0 0 30px ${step.color}30`,
              }}
            >
              <StepIcon size={36} style={{ color: step.color }} />
            </motion.div>

            {/* Title */}
            <motion.h2
              key={`title-${currentStep}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-center mb-3"
              style={{ color: 'white' }}
            >
              {step.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              key={`desc-${currentStep}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-center mb-6"
              style={{ color: '#7aa6c2' }}
            >
              {step.description}
            </motion.p>

            {/* Features List */}
            {step.features.length > 0 && (
              <motion.div
                key={`features-${currentStep}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3 mb-8"
              >
                {step.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(0,245,255,0.03)' }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${step.color}20` }}
                    >
                      <Check size={14} style={{ color: step.color }} />
                    </div>
                    <span className="text-sm" style={{ color: 'white' }}>
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-2 pt-6 border-t border-white/5">
              <div className="flex-1">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-all disabled:opacity-0 hover:bg-white/5"
                  style={{ color: '#7aa6c2' }}
                >
                  <ChevronLeft size={18} />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </button>
              </div>

              <div className="flex items-center gap-2 px-4">
                {ONBOARDING_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      background: index === currentStep ? step.color : 'rgba(255,255,255,0.1)',
                      width: index === currentStep ? '24px' : '6px',
                    }}
                  />
                ))}
              </div>

              <div className="flex-1 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                    color: '#020b18',
                    minWidth: isLastStep ? '140px' : '100px',
                    boxShadow: `0 4px 15px ${step.color}40`,
                  }}
                >
                  {isLastStep ? (
                    <>
                      <Check size={18} strokeWidth={3} />
                      <span>Mulai</span>
                    </>
                  ) : (
                    <>
                      <span>Lanjut</span>
                      <ChevronRight size={18} />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}