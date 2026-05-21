import { motion } from 'framer-motion'
import ImageAvatar from '../ui/ImageAvatar'

const conditionConfig = {
  good: {
    label: 'Kondisi Keuangan Prima',
    color: '#4ade80',
    colorDim: 'rgba(74, 222, 128, 0.12)',
    score: 85,
    scoreLabel: 'Sangat Baik',
    message: 'Finansialmu dalam kondisi sangat baik! Terus pertahankan.',
    recommendation: 'Alokasikan 10% pendapatan tambahanmu ke instrumen investasi agresif.',
  },
  normal: {
    label: 'On Track',
    color: '#fbbf24',
    colorDim: 'rgba(251, 191, 36, 0.12)',
    score: 62,
    scoreLabel: 'Cukup Baik',
    message: 'Finansialmu cukup baik. Masih ada ruang untuk perbaikan.',
    recommendation: 'Coba kurangi pengeluaran hiburan sebesar 5% untuk dana darurat.',    
  },
  bad: {
    label: 'Perlu Perbaikan',
    color: '#f87171',
    colorDim: 'rgba(248, 113, 113, 0.12)',
    score: 35,
    scoreLabel: 'Perlu Perhatian',
    message: 'Finansialmu membutuhkan perhatian lebih. Buat rencana perbaikan.',
    recommendation: 'Fokus lunasi hutang berbunga tinggi dan tunda pengeluaran besar.',   
  },
}

export default function AvatarConditionBanner({ 
  balance = 0, 
  targetPension = 500000000, 
  userName = 'User',
  gender = 'male',
  condition: propCondition,
  projectedWealth = 0,
  pensionSurvivalYears = 0,
  monthlyIncome = 5000000,
  monthlyExpense = 3500000
}) {
  // Use propCondition if passed, otherwise default to normal
  const condition = propCondition || 'normal'
  const config = conditionConfig[condition] || conditionConfig.normal

  // Calculate pension target progress
  // If we have projected wealth from the backend, we use it to calculate progress towards target retirement fund
  const wealthForProgress = projectedWealth > 0 ? projectedWealth : balance
  const progressPercent = Math.min(100, Math.max(0, (wealthForProgress / targetPension) * 100))     
  
  // Calculate dynamic Health Score
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
    if (val >= 1000000) {
      return `Rp ${(val / 1000000).toFixed(1)}Jt`
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

          <h2 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>
            {userName}
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>Financial Profile</p>

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
          <div className="w-full mt-6 pt-6 border-t" style={{ borderColor: `${config.color}20` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Health Score
                </span>
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: config.color }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base" style={{ color: config.color }}>    
                  {healthScore}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/100</span>
              </div>
            </div>

            <div className="relative">
              <div
                className="w-full h-3.5 rounded-full overflow-hidden"
                style={{
                  backgroundColor: 'var(--dark-3)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${healthScore}%` }}
                  transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                  className="h-full rounded-full relative"
                  style={{
                    background: `linear-gradient(90deg, ${config.color} 0%, ${config.color}dd 100%)`,
                    boxShadow: `0 0 10px ${config.color}80`,
                  }}
                >
                  <div className="absolute inset-0 shimmer-text" />
                </motion.div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{config.scoreLabel}</span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Survival: {pensionSurvivalYears.toFixed(1)} tahun</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Quick Stats & Message */}
      <div className="space-y-4">
        {/* Financial Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card rounded-2xl p-5 border"
          style={{ borderColor: 'var(--glass-border)' }}
        >
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Statistik Keuangan</h3>
          <div className="grid grid-cols-2 gap-3">
            <div
              className="p-4 rounded-xl text-center"
              style={{
                background: 'rgba(74, 222, 128, 0.08)',
                border: '1px solid rgba(74, 222, 128, 0.2)',
              }}
            >
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Pendapatan</p>
              <p className="text-lg font-bold" style={{ color: '#4ade80' }}>+{formatIDR(monthlyIncome)}</p> 
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Per bulan</p>   
            </div>
            <div
              className="p-4 rounded-xl text-center"
              style={{
                background: 'rgba(248, 113, 113, 0.08)',
                border: '1px solid rgba(248, 113, 113, 0.2)',
              }}
            >
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Pengeluaran</p>
              <p className="text-lg font-bold" style={{ color: '#f87171' }}>-{formatIDR(monthlyExpense)}</p> 
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Per bulan</p>   
            </div>
          </div>

          {/* Progress Pension */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Proyeksi Dana Pensiun</span>
                <span className="font-bold text-lg grad-text">{progressPercent.toFixed(1)}%</span>
              </div>
            </div>
            <div
              className="w-full h-3 rounded-full overflow-hidden"
              style={{
                backgroundColor: 'var(--dark-3)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                className="h-full rounded-full relative"
                style={{
                  background: 'var(--grad)',
                  boxShadow: '0 0 10px var(--cyan-glow)',
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs" style={{ color: 'var(--text-dim)' }}>Terproyeksi: {formatIDR(wealthForProgress)}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Target: {formatIDR(targetPension)}</span>
            </div>
          </div>
        </motion.div>

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
              <p className="font-semibold text-sm mb-1" style={{ color: config.color }}>Insight AI</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{config.message}</p>
            </div>
          </div>
        </motion.div>

        {/* Recommended Action - NEW SECTION to fill space */}
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
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Rekomendasi Alokasi Aset</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--cyan)' }}>Instrumen Disarankan</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {propCondition === 'good' ? 'Saham, reksadana saham, campuran' : 
                 propCondition === 'normal' ? 'Obligasi, reksadana pendapatan tetap' : 
                 'Dana darurat, kurangi pengeluaran, reksadana pasar uang'}
              </p>
            </div>

            <button className="w-full py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-cyan-500/20"
              style={{
                border: '1px solid var(--cyan)',
                color: 'var(--cyan)',
                background: 'rgba(0, 245, 255, 0.05)'
              }}
            >
              Lihat Detail Strategi Investasi
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
