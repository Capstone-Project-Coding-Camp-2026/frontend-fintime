import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { STEP_LABELS } from './registerConstants'

// ============================================================
// STEP CHECKPOINT
// Komponen indikator step di atas form
// ============================================================
export function StepCheckpoint({ step, current }) {
  const done = step < current
  const active = step === current

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500"
        style={{
          background: done || active ? 'rgba(0,245,255,0.1)' : 'rgba(6,21,40,0.5)',
          borderColor: done ? '#00f5ff' : active ? '#00f5ff' : 'rgba(0,245,255,0.2)',
          color: done || active ? '#00f5ff' : 'rgba(0,245,255,0.4)',
          boxShadow: active
            ? '0 0 12px rgba(0,245,255,0.4)'
            : done ? '0 0 6px rgba(0,245,255,0.25)' : 'none',
        }}
      >
        {done ? <Check size={12} strokeWidth={3} /> : step + 1}
      </div>
      <span
        className="text-[9px] font-bold tracking-wider uppercase hidden sm:block"
        style={{ color: active ? '#00f5ff' : done ? 'rgba(0,245,255,0.6)' : 'rgba(0,245,255,0.25)' }}
      >
        {STEP_LABELS[step]}
      </span>
    </div>
  )
}