import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { BookOpen, Tag, TrendingUp, FlaskConical } from 'lucide-react'

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Smart Ledger',
    subtitle: 'AI Pencatat Transaksi',
    description:
      'Semua transaksi otomatis dicatat & dikategorikan menggunakan NLP AI. Sistem belajar pola pengeluaran kamu dan menemukan pattern yang mungkin kamu sendiri ga sadar.',
    tag: 'NLP Engine',
    tagColor: '#00b4d8',
    accent: '🧠',
  },
  {
    icon: Tag,
    title: 'Behavior Analysis',
    subtitle: 'AI Pembaca Pola Spending',
    description:
      'Bukan cuma kategori biasa. FinTime mendeteksi emotional spending, FOMO buying, lifestyle inflation, dan kebocoran budget kecil yang sering ga kerasa.',
    tag: 'Behavioral AI',
    tagColor: '#00d4a8',
    accent: '🔬',
  },
  {
    icon: TrendingUp,
    title: 'Future Forecast',
    subtitle: 'Prediksi Finansial Masa Depan',
    description:
      'AI memproyeksikan kondisi finansial kamu hingga puluhan tahun ke depan. Lihat kapan tabungan mulai habis dan keputusan apa yang bisa memperpanjang keamanan finansialmu.',
    tag: 'ML Forecasting',
    tagColor: '#ffd700',
    accent: '⚡',
  },
  {
    icon: FlaskConical,
    title: 'What-If Lab',
    subtitle: 'Simulator Keputusan Finansial',
    description:
      '"Kalau aku beli mobil tahun 2027 gimana ya?" Semua keputusan bisa disimulasikan. Lihat efek domino finansialnya secara real-time.',
    tag: 'Simulation Engine',
    tagColor: '#ff6b6b',
    accent: '🎯',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function FeaturesSection() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background decorations */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 30% 50%, rgba(0,150,199,0.06) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 40% 40% at 90% 20%, rgba(0,245,255,0.04) 0%, transparent 60%)',
        }}
      />

      <div className="container max-w-6xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="section-label">Fitur Utama</div>
          <h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none mb-4"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            AI yang{' '}
            <span className="grad-text">Bekerja Untukmu</span>
          </h2>
          <p
            className="text-base leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            Empat fitur utama FinTime yang menggabungkan NLP, machine learning, dan simulasi
            untuk memberikan gambaran finansial masa depanmu yang paling akurat.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              animate={isVisible ? 'visible' : 'hidden'}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative rounded-3xl p-6 md:p-8 overflow-hidden"
              style={{
                background: 'rgba(6,21,40,0.7)',
                border: `1px solid ${feature.tagColor}20`,
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Corner glow on hover */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                style={{ backgroundColor: feature.tagColor }}
              />

              {/* Tag */}
              <div className="flex items-center justify-between mb-5">
                <span
                  className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
                  style={{
                    background: `${feature.tagColor}15`,
                    color: feature.tagColor,
                    border: `1px solid ${feature.tagColor}30`,
                  }}
                >
                  {feature.tag}
                </span>
                <span className="text-2xl">{feature.accent}</span>
              </div>

              {/* Icon + Title */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${feature.tagColor}12`,
                    border: `1px solid ${feature.tagColor}25`,
                  }}
                >
                  <feature.icon size={24} style={{ color: feature.tagColor }} />
                </div>
                <div>
                  <h3
                    className="text-xl font-bold tracking-tight"
                    style={{ color: 'var(--text)' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-xs" style={{ color: feature.tagColor }}>
                    {feature.subtitle}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                {feature.description}
              </p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, transparent, ${feature.tagColor}60, transparent)`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
