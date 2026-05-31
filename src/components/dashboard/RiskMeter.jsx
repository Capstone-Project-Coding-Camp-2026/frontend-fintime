import React from 'react'

/**
 * RiskMeter: component yg menampilkan bar horizontal yg merepresentasikan skor risiko pengguna
 * Props:
 *  - riskProfile: { score: number, label: string, color: string }
 */
export default function RiskMeter({ riskProfile }) {
  if (!riskProfile) return null
  console.log('RISK SCORE:', riskProfile)
  const widthPercent = Math.min(
    Math.max((riskProfile.score / 10) * 100, 0),
    100,
  )
  return (
    <section className="mt-6">
      <h3 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>
        Risk Meter
      </h3>
      <div className="flex items-center">
        <div
          className="flex-1 h-4 bg-gray-200 rounded"
          style={{ background: 'rgba(0,0,0,0.1)' }}
        >
          <div
            className="h-4 rounded"
            style={{
              width: `${widthPercent}%`,
              backgroundColor: riskProfile.color,
            }}
          ></div>
        </div>
        <span className="ml-2 text-sm" style={{ color: riskProfile.color }}>
          {riskProfile.label}
        </span>
      </div>
    </section>
  )
}
