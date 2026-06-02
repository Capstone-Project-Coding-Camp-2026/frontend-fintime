import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { CheckCircle, AlertTriangle, XCircle, TrendingUp } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const verdictConfig = {
  good: {
    label: 'JUST BUY',
    Icon: CheckCircle,
    color: '#4ade80',
    colorDim: 'rgba(74, 222, 128, 0.1)',
    border: 'rgba(74, 222, 128, 0.2)',
    msgKey: 'dash_verdict_good_msg',
  },
  neutral: {
    label: 'BUY BUT BE CAREFUL',
    Icon: AlertTriangle,
    color: '#fbbf24',
    colorDim: 'rgba(251, 191, 36, 0.1)',
    border: 'rgba(251, 191, 36, 0.2)',
    msgKey: 'dash_verdict_neutral_msg',
  },
  bad: {
    label: 'DONT BUY',
    Icon: XCircle,
    color: '#f87171',
    colorDim: 'rgba(248, 113, 113, 0.1)',
    border: 'rgba(248, 113, 113, 0.2)',
    msgKey: 'dash_verdict_bad_msg',
  },
}

export default function AnalysisResult({
  goodPercent,
  neutralPercent,
  badPercent,
  verdict,
  price,
  monthlyPayment,
  // remainingBudget,
  totalPayment,
  selectedOption,
  hasResult,
  alternatives = []
}) {
  const { t } = useLanguage()

  const data = [
    { name: t('dash_verdict_good'), value: goodPercent, color: '#4ade80' },
    { name: t('dash_verdict_neutral'), value: neutralPercent, color: '#fbbf24' },
    { name: t('dash_verdict_bad'), value: badPercent, color: '#f87171' },
  ]

  const config = verdictConfig[verdict] || verdictConfig.neutral

  if (!hasResult) {
    return (
      <div
        className="glass-card rounded-2xl border p-6 flex flex-col items-center justify-center min-h-[400px]"
        style={{ borderColor: 'var(--glass-border)' }}
      >
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4">
          <TrendingUp size={32} className="text-cyan-400" />
        </div>
        <p className="text-gray-400 text-sm text-center max-w-[200px]">
          {t('dash_scenario_empty_state')}
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-2xl border p-6"
      style={{ borderColor: 'var(--glass-border)' }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--cyan-glow)' }}
        >
          <TrendingUp size={18} style={{ color: 'var(--cyan)' }} />
        </div>
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--text)' }}>Hasil Analisis</h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Probabilitas keputusan berdasarkan kondisi keuangan</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="h-48 mb-5 relative min-w-0 min-h-[192px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
              itemStyle={{ color: '#e2e8f0' }}
              formatter={(value) => [`${Number(value).toLocaleString('id-ID', { maximumFractionDigits: 1 })}%`, t('dash_probability')]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mb-5">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {item.name}<br />
                {Number(item.value).toLocaleString('id-ID', { maximumFractionDigits: 1 })}%
              </span>
          </div>
        ))}
      </div>

      {/* Verdict Banner */}
      <div
        className="rounded-xl p-4 mb-5 border"
        style={{
          backgroundColor: config.colorDim,
          borderColor: config.border,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <config.Icon size={20} style={{ color: config.color }} />
          <p className="text-sm font-bold" style={{ color: config.color }}>
            {config.label}
          </p>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {t(config.msgKey)}
        </p>
      </div>

      {/* Detail */}
      <div className="space-y-3">
        {[
          { label: t('dash_detail_price'), value: `Rp ${price.toLocaleString('id-ID')}` },
          { label: t('dash_detail_total'), value: `Rp ${totalPayment.toLocaleString('id-ID')}` },
          ...(selectedOption === 'paylater' ? [{ label: t('dash_detail_monthly'), value: `Rp ${monthlyPayment.toLocaleString('id-ID')}` }] : []),
          // {
          //   label: 'Sisa Budget',
          //   value: `Rp ${remainingBudget.toLocaleString('id-ID')}`,
          //   valueColor: remainingBudget >= 0 ? '#4ade80' : '#f87171',
          // },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: 'rgba(0, 245, 255, 0.04)', border: '1px solid rgba(0, 245, 255, 0.08)' }}
          >
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
            <span className="font-semibold" style={{ color: item.valueColor || 'var(--text)' }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Komparasi Skenario */}
      {alternatives && alternatives.length > 0 && (
        <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--glass-border)' }}>
          <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
            Komparasi Skenario
          </h4>
          <div className="space-y-2">
            {alternatives.map((alt, idx) => {
              let tagColor = '#fbbf24';
              let tagBg = 'rgba(251, 191, 36, 0.1)';
              let label = 'Waspada';
              
              if (alt.recommendation === 'just_buy') {
                tagColor = '#4ade80';
                tagBg = 'rgba(74, 222, 128, 0.1)';
                label = 'Aman';
              } else if (alt.recommendation === 'dont_buy') {
                tagColor = '#f87171';
                tagBg = 'rgba(248, 113, 113, 0.1)';
                label = 'Risiko Tinggi';
              }

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border transition-all"
                  style={{
                    background: 'rgba(0, 245, 255, 0.02)',
                    borderColor: 'rgba(0, 245, 255, 0.08)',
                  }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {alt.name}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {alt.monthly_payment > 0 
                        ? `Cicilan Rp ${alt.monthly_payment.toLocaleString('id-ID')}/bln` 
                        : `Total Rp ${alt.total_payment.toLocaleString('id-ID')}`}
                    </p>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: tagBg, color: tagColor }}
                  >
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  )
}