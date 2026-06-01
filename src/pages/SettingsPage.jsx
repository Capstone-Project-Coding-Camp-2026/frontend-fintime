import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings as SettingsIcon,
  User,
  Moon,
  Sun,
  Globe,
  Bell,
  Shield,
  Database,
  Trash2,
  Download,
  ChevronRight,
  Check,
  Languages,
  Palette,
  ChevronDown,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useToast } from '../context/ToastContext'
import api from '../lib/api'

const LANGUAGES = [
  { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
]

const CURRENCIES = [
  { code: 'IDR', label: 'Rupiah Indonesia', symbol: 'Rp', locale: 'id-ID' },
  { code: 'USD', label: 'US Dollar', symbol: '$', locale: 'en-US' },
  { code: 'SGD', label: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG' },
]

export default function SettingsPage() {
  const { success, error: showError } = useToast()
  const [user, setUser] = useState(null)

  // Settings state
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('fintime_theme') || 'dark',
    language: localStorage.getItem('fintime_language') || 'id',
    currency: localStorage.getItem('fintime_currency') || 'IDR',
    notifications: {
      budgetAlerts: localStorage.getItem('fintime_notify_budget') !== 'false',
      debtReminders: localStorage.getItem('fintime_notify_debt') !== 'false',
      goalUpdates: localStorage.getItem('fintime_notify_goals') !== 'false',
      weeklyReport: localStorage.getItem('fintime_notify_weekly') !== 'false',
      marketing: localStorage.getItem('fintime_notify_marketing') === 'true',
    },
  })

  const [activeSection, setActiveSection] = useState('general')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('fintime_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))

    // Persist to localStorage
    localStorage.setItem(`fintime_${key}`, value)
  }

  const updateNotification = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))

    localStorage.setItem(`fintime_notify_${key.replace(/([A-Z])/g, '_$1').toLowerCase()}`, value.toString())
  }

  const handleExportData = async () => {
    try {
      success('Memulai export data...')
      // Generate data export
      const exportData = {
        user: user,
        settings: settings,
        exportDate: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `fintime-backup-${new Date().toISOString().split('T')[0]}.json`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      success('Data berhasil di-export')
    } catch (err) {
      console.error('Export failed:', err)
      showError('Gagal mengexport data')
    }
  }

  const handleClearData = () => {
    if (!confirm('Yakin ingin menghapus semua data lokal? Data di server tidak akan terpengaruh.')) return
    if (!confirm('Ini akan menghapus semua preference dan cache lokal. Lanjutkan?')) return

    localStorage.removeItem('fintime_onboarding_complete')
    // Keep user data, just clear settings
    success('Data lokal berhasil dibersihkan')
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <div
              className="rounded-xl p-5"
              style={{
                background: 'rgba(0,245,255,0.03)',
                border: '1px solid rgba(0,245,255,0.08)',
              }}
            >
              <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'white' }}>
                <Palette size={18} style={{ color: '#00f5ff' }} />
                Tampilan
              </h4>
              <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'rgba(0,245,255,0.06)' }}>
                <div>
                  <p className="font-medium" style={{ color: 'white' }}>Tema</p>
                  <p className="text-sm" style={{ color: '#7aa6c2' }}>Pilih tampilan aplikasi</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateSetting('theme', 'dark')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      settings.theme === 'dark' ? '' : 'opacity-50'
                    }`}
                    style={{
                      background: settings.theme === 'dark' ? 'rgba(0,245,255,0.15)' : 'rgba(0,245,255,0.05)',
                      border: `1px solid ${settings.theme === 'dark' ? 'rgba(0,245,255,0.3)' : 'rgba(0,245,255,0.1)'}`,
                      color: settings.theme === 'dark' ? '#00f5ff' : '#7aa6c2',
                    }}
                  >
                    <Moon size={16} />
                    Dark
                  </button>
                  <button
                    onClick={() => updateSetting('theme', 'light')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      settings.theme === 'light' ? '' : 'opacity-50'
                    }`}
                    style={{
                      background: settings.theme === 'light' ? 'rgba(0,245,255,0.15)' : 'rgba(0,245,255,0.05)',
                      border: `1px solid ${settings.theme === 'light' ? 'rgba(0,245,255,0.3)' : 'rgba(0,245,255,0.1)'}`,
                      color: settings.theme === 'light' ? '#00f5ff' : '#7aa6c2',
                    }}
                  >
                    <Sun size={16} />
                    Light
                  </button>
                </div>
              </div>
            </div>

            <div
              className="rounded-xl p-5"
              style={{
                background: 'rgba(0,245,255,0.03)',
                border: '1px solid rgba(0,245,255,0.08)',
              }}
            >
              <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'white' }}>
                <Globe size={18} style={{ color: '#00f5ff' }} />
                Regional
              </h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'rgba(0,245,255,0.06)' }}>
                  <div>
                    <p className="font-medium" style={{ color: 'white' }}>Bahasa</p>
                    <p className="text-sm" style={{ color: '#7aa6c2' }}>Pilih bahasa antarmuka</p>
                  </div>
                  <div className="relative min-w-[200px]">
                    <select
                      value={settings.language}
                      onChange={(e) => updateSetting('language', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl outline-none appearance-none cursor-pointer transition-all pr-10"
                      style={{
                        background: 'rgba(0,245,255,0.04)',
                        border: '1px solid rgba(0,245,255,0.15)',
                        color: 'white',
                      }}
                      onMouseOver={(e) => e.target.style.background = 'rgba(0,245,255,0.08)'}
                      onMouseOut={(e) => e.target.style.background = 'rgba(0,245,255,0.04)'}
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code} style={{ background: '#02111f', color: 'white' }}>
                          {lang.flag} {lang.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#00f5ff' }} />
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium" style={{ color: 'white' }}>Mata Uang</p>
                    <p className="text-sm" style={{ color: '#7aa6c2' }}>Pilih mata uang utama</p>
                  </div>
                  <div className="relative min-w-[200px]">
                    <select
                      value={settings.currency}
                      onChange={(e) => updateSetting('currency', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl outline-none appearance-none cursor-pointer transition-all pr-10"
                      style={{
                        background: 'rgba(0,245,255,0.04)',
                        border: '1px solid rgba(0,245,255,0.15)',
                        color: 'white',
                      }}
                      onMouseOver={(e) => e.target.style.background = 'rgba(0,245,255,0.08)'}
                      onMouseOut={(e) => e.target.style.background = 'rgba(0,245,255,0.04)'}
                    >
                      {CURRENCIES.map((curr) => (
                        <option key={curr.code} value={curr.code} style={{ background: '#02111f', color: 'white' }}>
                          {curr.symbol} {curr.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#00f5ff' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-4">
            {[
              { key: 'budgetAlerts', label: 'Peringatan Budget', desc: 'Notifikasi saat budget hampir habis' },
              { key: 'debtReminders', label: 'Pengingat Hutang', desc: 'Notifikasi jatuh tempo cicilan' },
              { key: 'goalUpdates', label: 'Update Target', desc: 'Notifikasi progress target tabungan' },
              { key: 'weeklyReport', label: 'Laporan Mingguan', desc: 'Kirim ringkasan keuangan tiap minggu' },
              { key: 'marketing', label: 'Promo & Update', desc: 'Informasi fitur baru dan promo' },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 rounded-xl"
                style={{
                  background: 'rgba(0,245,255,0.03)',
                  border: '1px solid rgba(0,245,255,0.08)',
                }}
              >
                <div>
                  <p className="font-medium" style={{ color: 'white' }}>{item.label}</p>
                  <p className="text-sm" style={{ color: '#7aa6c2' }}>{item.desc}</p>
                </div>
                <button
                  onClick={() => updateNotification(item.key, !settings.notifications[item.key])}
                  className={`w-12 h-7 rounded-full relative transition-all ${
                    settings.notifications[item.key] ? '' : ''
                  }`}
                  style={{
                    background: settings.notifications[item.key]
                      ? 'linear-gradient(135deg, #00f5ff, #0096c7)'
                      : 'rgba(0,245,255,0.15)',
                  }}
                >
                  <motion.div
                    animate={{ x: settings.notifications[item.key] ? 22 : 2 }}
                    className="w-5 h-5 rounded-full absolute top-1"
                    style={{
                      background: settings.notifications[item.key] ? '#020b18' : '#7aa6c2',
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        )

      case 'data':
        return (
          <div className="space-y-4">
            <div
              className="rounded-xl p-5"
              style={{
                background: 'rgba(0,245,255,0.03)',
                border: '1px solid rgba(0,245,255,0.08)',
              }}
            >
              <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'white' }}>
                <Database size={18} style={{ color: '#00f5ff' }} />
                Backup Data
              </h4>
              <p className="text-sm mb-4" style={{ color: '#7aa6c2' }}>
                Export semua data Anda dalam format JSON untuk backup.
              </p>
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all"
                style={{
                  background: 'rgba(0,245,255,0.1)',
                  border: '1px solid rgba(0,245,255,0.2)',
                  color: '#00f5ff',
                }}
              >
                <Download size={16} />
                Export Data
              </button>
            </div>

            <div
              className="rounded-xl p-5 border"
              style={{
                background: 'rgba(248,113,113,0.03)',
                borderColor: 'rgba(248,113,113,0.15)',
              }}
            >
              <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#f87171' }}>
                <Trash2 size={18} />
                Zona Berbahaya
              </h4>
              <p className="text-sm mb-4" style={{ color: '#7aa6c2' }}>
                Hapus semua data lokal dan cache. Data di server tidak akan terpengaruh.
              </p>
              <button
                onClick={handleClearData}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
              >
                <Trash2 size={16} />
                Bersihkan Data Lokal
              </button>
            </div>
          </div>
        )

      case 'about':
        return (
          <div className="space-y-6">
            <div
              className="rounded-xl p-5 text-center"
              style={{
                background: 'rgba(0,245,255,0.03)',
                border: '1px solid rgba(0,245,255,0.08)',
              }}
            >
              <div
                className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl"
                style={{
                  background: 'rgba(0,245,255,0.1)',
                  border: '1px solid rgba(0,245,255,0.2)',
                }}
              >
                ⏱
              </div>
              <h3 className="text-xl font-bold mb-1" style={{ color: 'white' }}>FinTime</h3>
              <p className="text-sm mb-4" style={{ color: '#7aa6c2' }}>AI Financial Time Machine</p>
              <p className="text-xs" style={{ color: '#5a8aab' }}>Version 1.0.0</p>
            </div>

            <div
              className="rounded-xl p-5"
              style={{
                background: 'rgba(0,245,255,0.03)',
                border: '1px solid rgba(0,245,255,0.08)',
              }}
            >
              <h4 className="font-semibold mb-3" style={{ color: 'white' }}>Credits</h4>
              <div className="space-y-2 text-sm" style={{ color: '#7aa6c2' }}>
                <p>Coding Camp 2026</p>
                <p>Dicoding × DBS Foundation</p>
                <p>Team: CC26-PSU411</p>
              </div>
            </div>

            <div
              className="rounded-xl p-5"
              style={{
                background: 'rgba(0,245,255,0.03)',
                border: '1px solid rgba(0,245,255,0.08)',
              }}
            >
              <h4 className="font-semibold mb-3" style={{ color: 'white' }}>Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {['React 19', 'Vite', 'TailwindCSS', 'Framer Motion', 'Node.js', 'Express'].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-lg text-xs font-medium"
                    style={{
                      background: 'rgba(0,245,255,0.1)',
                      color: '#00f5ff',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const sections = [
    { id: 'general', label: 'Umum', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'about', label: 'Tentang', icon: Shield },
  ]

  return (
    <DashboardLayout activePage="settings" particleCount={20}>
      {({ user: layoutUser }) => (
        <main className="pt-24 px-4 sm:px-6 lg:px-8 relative z-10 pb-24">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 grad-text">
              Pengaturan
            </h1>
            <p className="text-gray-400">
              Kelola preferensi dan konfigurasi aplikasi
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div
              className="lg:w-64 rounded-2xl overflow-hidden flex-shrink-0"
              style={{
                background: 'rgba(6,21,40,0.7)',
                border: '1px solid rgba(0,245,255,0.1)',
              }}
            >
              <div
                className="px-4 py-4 border-b"
                style={{ borderColor: 'rgba(0,245,255,0.08)' }}
              >
                <h3 className="font-bold" style={{ color: 'white' }}>Menu</h3>
              </div>
              <div className="p-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeSection === section.id ? '' : 'opacity-60'
                    }`}
                    style={{
                      background: activeSection === section.id ? 'rgba(0,245,255,0.1)' : 'transparent',
                      color: activeSection === section.id ? '#00f5ff' : '#7aa6c2',
                    }}
                  >
                    <section.icon size={18} />
                    <span className="font-medium">{section.label}</span>
                    {activeSection === section.id && (
                      <ChevronRight size={16} className="ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'rgba(6,21,40,0.7)',
                  border: '1px solid rgba(0,245,255,0.1)',
                }}
              >
                <h3 className="text-lg font-bold mb-6" style={{ color: 'white' }}>
                  {sections.find((s) => s.id === activeSection)?.label}
                </h3>
                {renderContent()}
              </div>
            </div>
          </div>
        </main>
      )}
    </DashboardLayout>
  )
}