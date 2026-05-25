import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { UserPlus, Link2, Bot, Eye } from 'lucide-react'

const STEPS = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Daftar Akun',
    description: 'Buat akunmu dalam hitungan menit. Isi data diri, preferensi keuangan, dan target pensiun.',
    color: '#00b4d8',
  },
  {
    icon: Link2,
    number: '02',
    title: 'Hubungkan Bank',
    description: 'Hubungkan rekening bank dan e-wallet. Sistem akan membaca riwayat transaksimu secara otomatis.',
    color: '#00d4a8',
  },
  {
    icon: Bot,
    number: '03',
    title: 'AI Menganalisis',
    description: 'NLP mengkategorikan transaksi. Model ML memprediksi pengeluaran dan menghitung proyeksi pensiun.',
    color: '#ffd700',
  },
  {
    icon: Eye,
    number: '04',
    title: 'Lihat Masa Depan',
    description: 'Dashboard menampilkan kondisi finansialmu: avatar berubah, skor kesehatan, dan rekomendasi AI.',
    color: '#00f5ff',
  },
]

export default function HowItWorksSection() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section
      id="how-it-works"
      className="relative py-24 md:py-32"
      style={{ background: 'var(--dark-2)' }}
    >
      <div className="neon-line absolute top-0 left-0 right-0" />

      <div className="container max-w-6xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="section-label">Cara Kerja</div>
          <h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none mb-4"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Mulai dalam{' '}
            <span className="grad-text">4 Langkah</span>
          </h2>
          <p
            className="text-base leading-relaxed max-w-xl mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            Dari registrasi sampai melihat proyeksi finansial masa depanmu, semuanya bisa dalam hitungan menit.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div
            className="hidden lg:block absolute"
            style={{
              top: '60px',
              left: '12.5%',
              right: '12.5%',
              height: '2px',
              background:
                'linear-gradient(90deg, #00b4d8, #00d4a8, #ffd700, #00f5ff)',
              opacity: 0.2,
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col items-center text-center group"
              >
                {/* Number circle */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative mb-6"
                >
                  <div
                    className="w-[120px] h-[120px] rounded-full flex items-center justify-center relative z-10"
                    style={{
                      background: `${step.color}08`,
                      border: `2px solid ${step.color}30`,
                    }}
                  >
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{
                        background: `${step.color}12`,
                        border: `1px solid ${step.color}40`,
                      }}
                    >
                      <step.icon size={32} style={{ color: step.color }} />
                    </div>
                  </div>
                  {/* Number badge */}
                  <div
                    className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black z-20"
                    style={{
                      background: step.color,
                      color: 'var(--dark)',
                      boxShadow: `0 0 20px ${step.color}60`,
                    }}
                  >
                    {step.number}
                  </div>
                  {/* Pulse ring */}
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      border: `1px solid ${step.color}40`,
                      animation: 'breathe 3s ease-in-out infinite',
                    }}
                  />
                </motion.div>

                {/* Content */}
                <h3
                  className="text-lg font-bold tracking-tight mb-2"
                  style={{ color: 'var(--text)' }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed max-w-[240px]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="neon-line absolute bottom-0 left-0 right-0" />
    </section>
  )
}
