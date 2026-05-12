import { motion } from 'framer-motion'

export function RegisterLeftPanel() {
  const stats = [
    { value: '4.2M+', label: 'Proyeksi Dihasilkan' },
    { value: 'AI', label: 'NLP Engine' },
    { value: '98%', label: 'Akurasi Model' },
    { value: '256-bit', label: 'Enkripsi' },
  ]

  return (
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
        transition={{ duration: 0.3 }}
        className="relative z-10 flex flex-col items-center text-center gap-6"
      >
        
        <div className="flex flex-col items-center gap-4 mb-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
            style={{
              borderColor: 'rgba(0,245,255,0.3)',
              boxShadow: '0 0 40px rgba(0,245,255,0.15)',
              background: 'rgba(0,245,255,0.05)',
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

        
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            <span style={{ color: 'var(--text)' }}>Time</span>
            <br />
            <span className="shimmer-text">Machine</span>
          </h2>
          <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
            Visualisasikan masa depan finansialmu.<br />
            Setiap keputusan kecil hari ini —<br />
            jadi hasil besar di masa depan.
          </p>
        </div>

        
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {stats.map(s => (
            <div
              key={s.label}
              className="p-3 rounded-xl text-center"
              style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.1)' }}
            >
              <div className="text-sm font-bold font-mono mb-0.5" style={{ color: '#00f5ff' }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        
        <div
          className="p-4 rounded-xl max-w-sm"
          style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.08)' }}
        >
          <p className="text-xs italic leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            "Compound interest is the eighth wonder of the world. He who understands it, earns it."
          </p>
          <p className="text-xs mt-2 font-bold" style={{ color: 'rgba(0,245,255,0.5)' }}>— Albert Einstein</p>
        </div>
      </motion.div>
    </div>
  )
}
