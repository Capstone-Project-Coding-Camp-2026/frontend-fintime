import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Rocket, Shield, Zap } from 'lucide-react'

export default function CTASection() {
  const navigate = useNavigate()
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="cta" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background glow effects */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,150,199,0.12) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,245,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.02) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="container max-w-4xl mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full"
            style={{
              background: 'rgba(0,245,255,0.07)',
              border: '1px solid rgba(0,245,255,0.2)',
            }}
          >
            <Zap size={14} style={{ color: '#00f5ff' }} />
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: 'var(--cyan)' }}
            >
              Gratis untuk memulai
            </span>
          </div>

          {/* Headline */}
          <h2
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none mb-6"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            <span style={{ color: 'var(--text)' }}>Siap Lihat</span>
            <br />
            <span className="grad-text">Masa Depan Finansialmu?</span>
          </h2>

          <p
            className="text-lg leading-relaxed max-w-xl mx-auto mb-10"
            style={{ color: 'var(--text-muted)' }}
          >
            Mulai perjalanan finansialmu sekarang. Biarkan AI yang bekerja untukmu — prediksi, analisis, dan simulasi, semua dalam satu platform.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/register')}
              className="btn-primary flex items-center gap-2.5 px-8 py-4 text-base font-extrabold rounded-full"
            >
              <Rocket size={18} />
              <span>Mulai Sekarang — Gratis</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="btn-ghost flex items-center gap-2 px-6 py-4 text-sm font-bold"
            >
              Sudah punya akun? Masuk
            </motion.button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: Shield, text: 'Data terenkripsi 256-bit' },
              { icon: Zap, text: 'AI-powered prediction' },
              { icon: Rocket, text: 'Hasil dalam hitungan detik' },
            ].map((badge) => (
              <div
                key={badge.text}
                className="flex items-center gap-2 text-xs"
                style={{ color: 'var(--text-dim)' }}
              >
                <badge.icon size={14} style={{ color: 'rgba(0,245,255,0.5)' }} />
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
