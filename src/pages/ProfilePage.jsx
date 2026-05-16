import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  LogOut, LayoutDashboard, Settings, User as UserIcon, Bell,
  Mail, Phone, Calendar, Briefcase, DollarSign, UserCircle,
  Edit2, Save, X, Camera, Shield, ChevronDown, Menu,
  TrendingUp, Clock
} from 'lucide-react'

import ParticleField from '../components/Particlefield'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    jobType: '',
    monthlyIncome: ''
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) setMobileMenuOpen(false)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const storedUser = localStorage.getItem('fintime_user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setFormData({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        jobType: userData.jobType || '',
        monthlyIncome: userData.monthlyIncome || ''
      })
    } else {
      navigate('/login')
    }

    return () => window.removeEventListener('resize', checkMobile)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('fintime_token')
    localStorage.removeItem('fintime_user')
    navigate('/login')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    const updatedUser = { ...user, ...formData }
    localStorage.setItem('fintime_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      jobType: user.jobType || '',
      monthlyIncome: user.monthlyIncome || ''
    })
    setIsEditing(false)
  }

  if (!user) return null

  const profileFields = [
    { icon: UserCircle, label: 'Nama Lengkap', name: 'fullName', type: 'text', value: formData.fullName, placeholder: 'Masukkan nama lengkap' },
    { icon: Mail, label: 'Alamat Email', name: 'email', type: 'email', value: formData.email, placeholder: 'nama@email.com' },
    { icon: Phone, label: 'Nomor Telepon', name: 'phone', type: 'tel', value: formData.phone, placeholder: '+62 xxx xxxx xxxx' },
    { icon: Briefcase, label: 'Pekerjaan', name: 'jobType', type: 'text', value: formData.jobType, placeholder: 'Contoh: Karyawan Swasta' },
    { icon: DollarSign, label: 'Pendapatan Bulanan', name: 'monthlyIncome', type: 'text', value: formData.monthlyIncome, placeholder: 'Rp. x.xxx.xxx' },
  ]

  const stats = [
    { icon: TrendingUp, label: 'Total Proyeksi', value: '12' },
    { icon: Shield, label: 'Akun Terverifikasi', value: '100%' },
    { icon: Clock, label: 'Bergabung', value: '6 Bulan' },
  ]

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-[#020b18] text-white font-['Sora'] overflow-x-hidden">
      <ParticleField count={40} />

      {/* Top Navigation Bar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 py-3"
        style={{
          height: '70px',
          background: 'rgba(2,11,24,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,245,255,0.08)',
        }}
      >
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(0,245,255,0.1)',
                border: '1px solid rgba(0,245,255,0.3)',
              }}
            >
              <span className="text-lg">⏱</span>
            </motion.div>
            <span className="text-xl font-extrabold hidden sm:block" style={{
              background: 'linear-gradient(135deg, #00f5ff, #0096c7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>FinTime</span>
          </div>

          {/* Desktop: User Profile + Logout */}
          {!isMobile && (
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-cyan-400 transition-all">
                <LayoutDashboard size={18} />
                <span className="font-medium">Dashboard</span>
              </button>

              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative hover:bg-white/10 transition-all">
                <Bell size={18} className="text-gray-300" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020b18]"></span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all"
                  style={{
                    background: 'rgba(0,245,255,0.05)',
                    border: '1px solid rgba(0,245,255,0.15)',
                  }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold">
                    {user.fullName?.charAt(0)}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold">{user.fullName}</p>
                    <p className="text-[10px] text-gray-500">{user.jobType ? user.jobType.charAt(0).toUpperCase() + user.jobType.slice(1).replace(/_/g, ' ') : 'Investor'}</p>
                  </div>
                  <ChevronDown size={16} style={{ color: 'var(--text-dim)' }} className={`transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden"
                      style={{
                        background: '#061528',
                        border: '1px solid rgba(0,245,255,0.15)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      }}
                    >
                      <div className="p-2">
                        <button
                          onClick={() => { navigate('/profile'); setProfileDropdownOpen(false) }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 transition-all"
                        >
                          <UserIcon size={18} />
                          <span className="font-medium">Profil Saya</span>
                        </button>
                      </div>
                      <div className="border-t border-white/5 p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <LogOut size={18} />
                          <span className="font-medium">Keluar</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Mobile: Menu Button */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,245,255,0.1)' }}
            >
              {mobileMenuOpen ? <X size={20} style={{ color: '#00f5ff' }} /> : <Menu size={20} style={{ color: '#00f5ff' }} />}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 rounded-xl overflow-hidden"
              style={{
                background: '#061528',
                border: '1px solid rgba(0,245,255,0.15)',
              }}
            >
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg font-bold">
                    {user.fullName?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{user.fullName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button
                  onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-all"
                >
                  <LayoutDashboard size={18} />
                  <span className="font-medium">Dashboard</span>
                </button>
                <button
                  onClick={() => { navigate('/profile'); setMobileMenuOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 transition-all"
                >
                  <UserIcon size={18} />
                  <span className="font-medium">Profil Saya</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Keluar</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-24 relative z-10 pb-20">
        {/* Hero Header */}
        <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #061528 0%, #020b18 100%)' }}>
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(0,245,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(0,245,255,0.1) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)',
          }} />

          <div className="relative p-6 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">Profil User</h1>
                <p className="text-gray-400">Kelola informasi akun dan pengaturan Anda</p>
              </div>
              <div className="flex items-center gap-3">
                <AnimatePresence mode="wait">
                  {!isEditing ? (
                    <motion.button
                      key="edit"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #00f5ff, #0096c7)',
                        color: '#020b18',
                      }}
                    >
                      <Edit2 size={18} />
                      <span>Edit Profil</span>
                    </motion.button>
                  ) : (
                    <motion.div
                      key="buttons"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2"
                    >
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all font-semibold"
                      >
                        <X size={18} />
                        <span>Batal</span>
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all"
                        style={{
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          color: '#fff',
                        }}
                      >
                        <Save size={18} />
                        <span>Simpan</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-10 space-y-8">
          {/* Avatar Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(6,21,40,0.9), rgba(2,11,24,0.9))',
              border: '1px solid rgba(0,245,255,0.1)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-32 h-32 rounded-2xl p-[3px]"
                    style={{
                      background: 'linear-gradient(135deg, #00f5ff, #0096c7, #7c3aed)',
                      boxShadow: '0 0 40px rgba(0,245,255,0.3)',
                    }}
                  >
                    <div className="w-full h-full rounded-2xl flex items-center justify-center" style={{ background: '#020b18' }}>
                      <span className="text-5xl font-black" style={{ color: '#00f5ff' }}>
                        {user.fullName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  </motion.div>
                  {isEditing && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #00f5ff, #0096c7)',
                        boxShadow: '0 4px 20px rgba(0,245,255,0.4)',
                      }}
                    >
                      <Camera size={20} style={{ color: '#020b18' }} />
                    </motion.button>
                  )}
                  <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-green-500 border-4 border-[#020b18]" />
                </div>

                {/* User Info */}
                <div className="text-center lg:text-left flex-1">
                  <h2 className="text-2xl font-bold mb-2">{user.fullName}</h2>
                  <p className="text-gray-400 mb-4">{user.email}</p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                    <span className="px-4 py-2 rounded-xl text-sm font-semibold" style={{
                      background: 'rgba(0,245,255,0.1)',
                      border: '1px solid rgba(0,245,255,0.2)',
                      color: '#00f5ff',
                    }}>
                      {user.jobType ? user.jobType.charAt(0).toUpperCase() + user.jobType.slice(1).replace(/_/g, ' ') : 'Investor'}
                    </span>
                    {user.gender && (
                      <span className="px-4 py-2 rounded-xl text-sm font-semibold" style={{
                        background: 'rgba(168,85,247,0.1)',
                        border: '1px solid rgba(168,85,247,0.2)',
                        color: '#a855f7',
                      }}>
                        {user.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 lg:gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="text-center p-4 rounded-xl"
                      style={{
                        background: 'rgba(0,245,255,0.03)',
                        border: '1px solid rgba(0,245,255,0.08)',
                      }}
                    >
                      <stat.icon size={24} className="mx-auto mb-2" style={{ color: '#00f5ff' }} />
                      <div className="text-xl font-bold" style={{ color: '#00f5ff' }}>{stat.value}</div>
                      <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 rounded-2xl p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(6,21,40,0.9), rgba(2,11,24,0.9))',
                border: '1px solid rgba(0,245,255,0.1)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,245,255,0.1)' }}>
                  <UserCircle size={20} style={{ color: '#00f5ff' }} />
                </div>
                Informasi Personal
              </h3>

              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="edit-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    {profileFields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                          <field.icon size={14} />
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3 rounded-xl transition-all focus:outline-none"
                          style={{
                            background: 'rgba(0,245,255,0.05)',
                            border: '1px solid rgba(0,245,255,0.15)',
                            color: '#e0f7ff',
                          }}
                        />
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="view-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    {profileFields.map((field) => (
                      <motion.div
                        key={field.name}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl"
                        style={{
                          background: 'rgba(0,245,255,0.03)',
                          border: '1px solid rgba(0,245,255,0.08)',
                        }}
                      >
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-3">
                          <field.icon size={14} />
                          {field.label}
                        </label>
                        <p className="text-lg font-medium">
                          {field.value || <span className="text-gray-500 italic">Belum diisi</span>}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Account Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Account Details */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(6,21,40,0.9), rgba(2,11,24,0.9))',
                  border: '1px solid rgba(0,245,255,0.1)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,245,255,0.1)' }}>
                    <Shield size={20} style={{ color: '#00f5ff' }} />
                  </div>
                  Info Akun
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,245,255,0.03)', border: '1px solid rgba(0,245,255,0.08)' }}>
                    <div className="flex items-center gap-3">
                      <Calendar size={18} style={{ color: '#00f5ff' }} />
                      <span className="text-sm text-gray-400">Bergabung</span>
                    </div>
                    <span className="font-semibold">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,245,255,0.03)', border: '1px solid rgba(0,245,255,0.08)' }}>
                    <div className="flex items-center gap-3">
                      <Shield size={18} style={{ color: '#00f5ff' }} />
                      <span className="text-sm text-gray-400">Status</span>
                    </div>
                    <span className="font-semibold px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
                      Aktif
                    </span>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div
                className="rounded-2xl p-6 border"
                style={{
                  background: 'rgba(248,113,113,0.03)',
                  borderColor: 'rgba(248,113,113,0.15)',
                }}
              >
                <h3 className="text-lg font-bold mb-4 text-red-400">Zona Berbahaya</h3>
                <p className="text-sm text-gray-400 mb-4">Tindakan di bawah tidak dapat dibatalkan.</p>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all font-semibold"
                >
                  <LogOut size={18} />
                  <span>Logout dari Perangkat</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#061528]/90 backdrop-blur-xl border-t border-white/5 p-3 flex justify-around items-center md:hidden z-50">
        <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-gray-400">
          <LayoutDashboard size={22} />
          <span className="text-[10px]">Dash</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-cyan-400 opacity-50 cursor-not-allowed">
          <UserIcon size={22} />
          <span className="text-[10px]">Profil</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <Settings size={22} />
          <span className="text-[10px]">Set</span>
        </button>
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-red-400">
          <LogOut size={22} />
          <span className="text-[10px]">Keluar</span>
        </button>
      </nav>
    </div>
  )
}