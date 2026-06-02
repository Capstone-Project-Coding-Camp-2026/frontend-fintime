import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, Check, Rocket, Target, PieChart, Zap, TrendingUp, Shield } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const getOnboardingSteps = (t) => [
  {
    id: 'welcome',
    title: t('onboard_1_title'),
    description: t('onboard_1_desc'),
    icon: Rocket,
    color: '#00f5ff',
    features: [
      t('onboard_1_f1'),
      t('onboard_1_f2'),
      t('onboard_1_f3'),
    ],
  },
  {
    id: 'dashboard',
    title: t('onboard_2_title'),
    description: t('onboard_2_desc'),
    icon: PieChart,
    color: '#a855f7',
    features: [
      t('onboard_2_f1'),
      t('onboard_2_f2'),
      t('onboard_2_f3'),
    ],
  },
  {
    id: 'budget',
    title: t('onboard_3_title'),
    description: t('onboard_3_desc'),
    icon: Target,
    color: '#fbbf24',
    features: [
      t('onboard_3_f1'),
      t('onboard_3_f2'),
      t('onboard_3_f3'),
    ],
  },
  {
    id: 'goals',
    title: t('onboard_4_title'),
    description: t('onboard_4_desc'),
    icon: TrendingUp,
    color: '#22c55e',
    features: [
      t('onboard_4_f1'),
      t('onboard_4_f2'),
      t('onboard_4_f3'),
    ],
  },
  {
    id: 'ai',
    title: t('onboard_5_title'),
    description: t('onboard_5_desc'),
    icon: Zap,
    color: '#ec4899',
    features: [
      t('onboard_5_f1'),
      t('onboard_5_f2'),
      t('onboard_5_f3'),
    ],
  },
  {
    id: 'complete',
    title: t('onboard_6_title'),
    description: t('onboard_6_desc'),
    icon: Shield,
    color: '#06b6d4',
    features: [],
  },
]

export default function OnboardingWizard({ onComplete, showOnboarding = false }) {
  const { t } = useLanguage()
  const ONBOARDING_STEPS = getOnboardingSteps(t)
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
          className="relative w-full max-w-lg rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
          style={{
            background: 'linear-gradient(180deg, rgba(6,21,40,0.95) 0%, rgba(2,11,24,0.98) 100%)',
            border: '1px solid rgba(0,245,255,0.2)',
            boxShadow: '0 0 60px rgba(0,245,255,0.15), 0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10 z-10"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <X size={18} />
          </button>

          {/* Progress Bar */}
          <div className="h-1 flex-shrink-0" style={{ background: 'rgba(0,245,255,0.1)' }}>
            <motion.div
              className="h-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
              style={{ background: step.color }}
            />
          </div>

          {/* Content */}
          <div className="p-5 sm:p-8 overflow-y-auto flex-1">
            {/* Icon */}
            <motion.div
              key={currentStep}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center flex-shrink-0"
              style={{
                background: `${step.color}15`,
                border: `2px solid ${step.color}40`,
                boxShadow: `0 0 30px ${step.color}30`,
              }}
            >
              <StepIcon size={32} className="sm:w-9 sm:h-9" style={{ color: step.color }} />
            </motion.div>

            {/* Title */}
            <motion.h2
              key={`title-${currentStep}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl sm:text-2xl font-bold text-center mb-2 sm:mb-3"
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
              className="text-center text-sm sm:text-base mb-4 sm:mb-6"
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
                className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8"
              >
                {step.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.1 }}
                    className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl"
                    style={{ background: 'rgba(0,245,255,0.03)' }}
                  >
                    <div
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${step.color}20` }}
                    >
                      <Check size={12} className="sm:w-3.5 sm:h-3.5" style={{ color: step.color }} />
                    </div>
                    <span className="text-xs sm:text-sm" style={{ color: 'white' }}>
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-auto pt-4 sm:pt-6 border-t border-white/5">
              <div className="flex-1">
                {currentStep > 0 ? (
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-all hover:bg-white/5"
                    style={{ color: '#7aa6c2' }}
                  >
                    <ChevronLeft size={18} />
                    <span className="hidden sm:inline">{t('onboard_prev')}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSkip}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-all hover:bg-white/5"
                    style={{ color: '#7aa6c2' }}
                  >
                    <span className="font-semibold text-sm">{t('onboard_skip')}</span>
                  </button>
                )}
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
                      <span>{t('onboard_start')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('onboard_next')}</span>
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