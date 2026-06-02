import { motion } from 'framer-motion'
import ImageAvatar from '../ui/ImageAvatar'
import { useLanguage } from '../../context/LanguageContext'

export default function AvatarConditionBanner({
  balance = 0,
  targetPension = 500000000,
  userName = 'User',
  gender = 'male',
  condition: propCondition,
  recommendedAssetClass,
  projectedWealth = 0,
  pensionSurvivalYears = 0,
  monthlyIncome = 5000000,
  monthlyExpense = 3500000,
}) {
  const { t } = useLanguage()

  const conditionConfig = {
    good: {
      label: t('cond_good_label'),
      color: '#4ade80',
      colorDim: 'rgba(74, 222, 128, 0.12)',
      score: 85,
      scoreLabel: t('cond_good_score'),
      message: t('cond_good_msg'),
      recommendation: t('cond_good_rec'),
    },
    normal: {
      label: t('cond_normal_label'),
      color: '#fbbf24',
      colorDim: 'rgba(251, 191, 36, 0.12)',
      score: 62,
      scoreLabel: t('cond_normal_score'),
      message: t('cond_normal_msg'),
      recommendation: t('cond_normal_rec'),
    },
    bad: {
      label: t('cond_bad_label'),
      color: '#f87171',
      colorDim: 'rgba(248, 113, 113, 0.12)',
      score: 35,
      scoreLabel: t('cond_bad_score'),
      message: t('cond_bad_msg'),
      recommendation: t('cond_bad_rec'),
    },
  }

  // Use propCondition if passed, otherwise default to normal
  const condition = propCondition || 'normal'
  const config = conditionConfig[condition] || conditionConfig.normal

  // Menghitung progress menuju target pension
  const wealthForProgress = projectedWealth > 0 ? projectedWealth : balance
  const progressPercent = Math.min(
    100,
    Math.max(0, (wealthForProgress / targetPension) * 100),
  )

  // Menghitung Skor Kesehatan berdasarkan kondisi dan proyeksi survival pension
  let healthScore = 50
  if (condition === 'good') {
    healthScore = Math.min(100, Math.round(75 + pensionSurvivalYears))
  } else if (condition === 'bad') {
    healthScore = Math.max(10, Math.round(pensionSurvivalYears * 5))
  } else {
    healthScore = Math.round(50 + pensionSurvivalYears)
  }

  // Format currency helpers
  const formatIDR = (val) => {
    if (val >= 1000000000) {
      return `Rp ${(val / 1000000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} ${t('cond_unit_miliar')}`
    }
    if (val >= 1000000) {
      return `Rp ${(val / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} ${t('cond_unit_juta')}`
    }
    return `Rp ${val.toLocaleString('id-ID')}`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 items-stretch">
      {/* Avatar Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border p-6 sm:p-7 flex flex-col"
        style={{
          background: `linear-gradient(135deg, ${config.colorDim} 0%, rgba(6, 21, 40, 0.6) 100%)`,
          borderColor: `${config.color}40`,
        }}
      >
        {/* Background Glow */}
        <div
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: config.color }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: config.color }}
        />

        <div className="relative z-10 flex flex-col items-center text-center flex-1">
          {/* Avatar dengan glow effect */}
          <div className="relative mb-4">
            <div
              className="absolute -inset-4 rounded-full opacity-50 blur-xl"
              style={{ backgroundColor: config.color }}
            />
            <motion.div
              className="absolute -inset-2 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, transparent 0%, ${config.color}40 30%, transparent 60%)`,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            <div
              className="absolute inset-0 rounded-full border-2 opacity-60"
              style={{ borderColor: config.color }}
            />
            <ImageAvatar
              gender={gender}
              condition={condition}
              size="xl"
              animated={true}
              className="relative z-10"
            />
          </div>

          <h2
            className="text-2xl sm:text-3xl font-bold mb-1"
            style={{ color: 'var(--text)' }}
          >
            {userName}
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
            Financial Profile
          </p>

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg"
            style={{
              background: config.colorDim,
              color: config.color,
              border: `1px solid ${config.color}50`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: config.color }}
            />
            {config.label}
          </motion.div>

          {/* Spacer to push Health Score to the bottom */}
          <div className="flex-1" />

          {/* Health Score */}
          <div
            className="w-full mt-6 pt-6 border-t"
            style={{ borderColor: `${config.color}20` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Health Score
                </span>
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: config.color }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-base"
                  style={{ color: config.color }}
                >
                  {healthScore}
                </span>
                <span
                  className="text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  /100
                </span>
              </div>
            </div>

            <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${healthScore}%` }}
                className="h-full rounded-full"
                style={{ backgroundColor: config.color }}
              />
            </div>
            <p
              className="text-[10px] mt-2 text-left font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              {config.scoreLabel}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats and Message Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col gap-5"
      >
        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            className="p-4 rounded-2xl border"
            style={{
              background: 'rgba(6, 21, 40, 0.4)',
              borderColor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
              {t('dash_total_balance')}
            </p>
            <p className="text-sm sm:text-base font-bold text-white">
              {formatIDR(balance)}
            </p>
          </div>
          <div
            className="p-4 rounded-2xl border"
            style={{
              background: 'rgba(6, 21, 40, 0.4)',
              borderColor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
              {t('dash_projected_wealth')}
            </p>
            <p className="text-sm sm:text-base font-bold text-cyan-400">
              {formatIDR(projectedWealth)}
            </p>
          </div>
          <div
            className="p-4 rounded-2xl border"
            style={{
              background: 'rgba(6, 21, 40, 0.4)',
              borderColor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
              Income / Mo
            </p>
            <p className="text-sm sm:text-base font-bold text-green-400">
              {formatIDR(monthlyIncome)}
            </p>
          </div>
          <div
            className="p-4 rounded-2xl border"
            style={{
              background: 'rgba(6, 21, 40, 0.4)',
              borderColor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
              Avg. Expense
            </p>
            <p className="text-sm sm:text-base font-bold text-red-400">
              {formatIDR(monthlyExpense)}
            </p>
          </div>
        </div>

        {/* AI Insight Card */}
        <div
          className="flex-1 p-6 sm:p-8 rounded-2xl border relative overflow-hidden flex flex-col justify-center"
          style={{
            background: 'rgba(6, 21, 40, 0.6)',
            borderColor: 'rgba(0, 245, 255, 0.1)',
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(0, 245, 255, 0.1)' }}
              >
                <span className="text-xl">💡</span>
              </div>
              <h3 className="font-bold text-lg text-white">AI Insight</h3>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6 text-sm sm:text-base">
              "{config.message}"
            </p>

            <div
              className="p-4 rounded-xl border border-dashed flex items-start gap-4"
              style={{
                background: 'rgba(0, 245, 255, 0.03)',
                borderColor: 'rgba(0, 245, 255, 0.2)',
              }}
            >
              <div
                className="mt-1 w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(0, 245, 255, 0.1)' }}
              >
                <span className="text-sm">🎯</span>
              </div>
              <div>
                <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">
                  Recommendation
                </p>
                <p className="text-sm text-gray-400 leading-snug">
                  {config.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Retirement Progress */}
        <div
          className="p-5 rounded-2xl border flex flex-col sm:flex-row items-center gap-6"
          style={{
            background: 'rgba(6, 21, 40, 0.4)',
            borderColor: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Retirement Readiness
              </p>
              <p className="text-xs font-bold text-cyan-400">
                {progressPercent.toFixed(1)}%
              </p>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(0,245,255,0.5)]"
              />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-[10px] text-gray-600">
                Target: {formatIDR(targetPension)}
              </p>
              <p className="text-[10px] text-gray-400">
                Longevity: {pensionSurvivalYears} {t('dash_pension_years')}
              </p>
            </div>
          </div>

          <div
            className="px-6 py-3 rounded-xl border flex flex-col items-center justify-center shrink-0 min-w-[140px]"
            style={{
              background: 'rgba(0, 245, 255, 0.05)',
              borderColor: 'rgba(0, 245, 255, 0.1)',
            }}
          >
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">
              Survival Projection
            </p>
            <p className="text-2xl font-black text-white">
              {pensionSurvivalYears}
              <span className="text-xs font-bold text-cyan-400 ml-1">
                {t('dash_pension_years').toUpperCase()}
              </span>
            </p>
          </div>
        </div>

        {/* AI Message */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card rounded-2xl p-5 border"
          style={{
            borderColor: `${config.color}40`,
            background: `linear-gradient(135deg, ${config.colorDim} 0%, rgba(6, 21, 40, 0.8) 100%)`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${config.color}30` }}
            >
              <span className="text-xl">💡</span>
            </div>
            <div>
              <p
                className="font-semibold text-sm mb-1"
                style={{ color: config.color }}
              >
                Insight AI
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                {config.message}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Alokasi Aset Recommended*/}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card rounded-2xl p-5 border"
          style={{ borderColor: 'var(--glass-border)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <span className="text-sm">🎯</span>
            </div>
            <h3
              className="font-semibold text-sm"
              style={{ color: 'var(--text)' }}
            >
              Rekomendasi Alokasi Aset
            </h3>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p
                className="text-xs font-medium mb-1"
                style={{ color: 'var(--cyan)' }}
              >
                Instrumen Disarankan
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                {recommendedAssetClass ||
                  (propCondition === 'good'
                    ? 'Saham, reksadana saham, campuran'
                    : propCondition === 'normal'
                      ? 'Obligasi, reksadana pendapatan tetap'
                      : 'Dana darurat, kurangi pengeluaran, reksadana pasar uang')}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
