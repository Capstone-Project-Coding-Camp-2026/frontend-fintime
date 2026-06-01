import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { INCOME_OPTIONS } from './registerConstants'

export function RegisterSuccess({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
        <CheckCircle2 size={32} style={{ color: '#00f5ff' }} />
      </div>

      
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight mb-1">
          Akun Berhasil <span className="grad-text">Dibuat!</span>
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Selamat, {data.fullName}. Siap memulai perjalanan finansialmu?
        </p>
      </div>
      
      <div
        className="w-full rounded-xl text-left"
        style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.12)' }}
      >
        {[
          { label: 'Nama', value: data.fullName },
          { label: 'Email', value: data.email },
          { label: 'Telepon', value: data.phone },
          { label: 'Pendapatan', value: `Rp ${data.monthlyIncome ? parseInt(data.monthlyIncome).toLocaleString('id-ID') : '—'} / bulan` },
          { label: 'Target Pensiun', value: `${data.retirementAge} tahun` },
          { label: 'Akun Dihubungkan', value: `${(data.linkedAccounts || []).length} akun` },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-3 px-4 border-b border-[rgba(0,245,255,0.06)] last:border-0"
          >
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{item.label}</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
