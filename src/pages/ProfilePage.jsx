import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Phone, Briefcase, DollarSign, UserCircle,
  Edit2, Save, X, Camera, Shield, Calendar,
  TrendingUp, Clock, LogOut,
} from 'lucide-react'

import api from '../lib/api'
import DashboardLayout from '../components/layout/DashboardLayout'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    occupation: '',
    monthlyIncome: '',
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('fintime_user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setFormData({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        occupation: userData.occupation || userData.jobType || '',
        monthlyIncome: userData.monthlyIncome || '',
      })
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const response = await api.put('/auth/profile', formData)
      if (response.data?.user) {
        const updatedUser = response.data.user
        localStorage.setItem('fintime_user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        setFormData({
          fullName: updatedUser.fullName || '',
          email: updatedUser.email || '',
          phone: updatedUser.phone || '',
          occupation: updatedUser.occupation || '',
          monthlyIncome: updatedUser.monthlyIncome || '',
        })
      }
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to save profile:', err)
      alert(err.response?.data?.message || 'Gagal menyimpan profil.')
    }
  }

  const handleCancel = () => {
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      occupation: user.occupation || '',
      monthlyIncome: user.monthlyIncome || '',
    })
    setIsEditing(false)
  }

  const profileFields = [
    { icon: UserCircle, label: 'Nama Lengkap', name: 'fullName', type: 'text', value: formData.fullName, placeholder: 'Masukkan nama lengkap' },
    { icon: Mail, label: 'Alamat Email', name: 'email', type: 'email', value: formData.email, placeholder: 'nama@email.com' },
    { icon: Phone, label: 'Nomor Telepon', name: 'phone', type: 'tel', value: formData.phone, placeholder: '+62 xxx xxxx xxxx' },
    { icon: Briefcase, label: 'Pekerjaan', name: 'occupation', type: 'text', value: formData.occupation, placeholder: 'Contoh: Software Engineer' },
    { icon: DollarSign, label: 'Pendapatan Bulanan', name: 'monthlyIncome', type: 'text', value: formData.monthlyIncome, placeholder: 'Rp. x.xxx.xxx' },
  ]

  const stats = [
    { icon: TrendingUp, label: 'Total Proyeksi', value: '12' },
    { icon: Shield, label: 'Akun Terverifikasi', value: '100%' },
    { icon: Clock, label: 'Bergabung', value: '6 Bulan' },
  ]

  return (
    <DashboardLayout activePage="profile" particleCount={40}>
      {({ user: layoutUser, handleLogout }) => (
        <main className="pt-24 relative z-10 pb-20">
          {/* Hero Header */}
          <div
            className="relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #061528 0%, #020b18 100%)' }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0,245,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.05) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
              }}
            />
            <div
              className="absolute top-0 right-0 w-96 h-96 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(0,245,255,0.1) 0%, transparent 70%)',
                transform: 'translate(30%, -30%)',
              }}
            />

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
                      <div
                        className="w-full h-full rounded-2xl flex items-center justify-center"
                        style={{ background: '#020b18' }}
                      >
                        <span className="text-5xl font-black" style={{ color: '#00f5ff' }}>
                          {(user || layoutUser)?.fullName?.charAt(0).toUpperCase() || 'U'}
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
                    <h2 className="text-2xl font-bold mb-2">{(user || layoutUser)?.fullName}</h2>
                    <p className="text-gray-400 mb-4">{(user || layoutUser)?.email}</p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                      <span
                        className="px-4 py-2 rounded-xl text-sm font-semibold"
                        style={{
                          background: 'rgba(0,245,255,0.1)',
                          border: '1px solid rgba(0,245,255,0.2)',
                          color: '#00f5ff',
                        }}
                      >
                        {(user || layoutUser)?.occupation || 'Investor'}
                      </span>
                      {(user || layoutUser)?.gender && (
                        <span
                          className="px-4 py-2 rounded-xl text-sm font-semibold"
                          style={{
                            background: 'rgba(168,85,247,0.1)',
                            border: '1px solid rgba(168,85,247,0.2)',
                            color: '#a855f7',
                          }}
                        >
                          {(user || layoutUser)?.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
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
                        <div className="text-xl font-bold" style={{ color: '#00f5ff' }}>
                          {stat.value}
                        </div>
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
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(0,245,255,0.1)' }}
                  >
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
                            {field.value || (
                              <span className="text-gray-500 italic">Belum diisi</span>
                            )}
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
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(0,245,255,0.1)' }}
                    >
                      <Shield size={20} style={{ color: '#00f5ff' }} />
                    </div>
                    Info Akun
                  </h3>

                  <div className="space-y-4">
                    <div
                      className="flex items-center justify-between p-4 rounded-xl"
                      style={{
                        background: 'rgba(0,245,255,0.03)',
                        border: '1px solid rgba(0,245,255,0.08)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Calendar size={18} style={{ color: '#00f5ff' }} />
                        <span className="text-sm text-gray-400">Bergabung</span>
                      </div>
                      <span className="font-semibold">
                        {(user || layoutUser)?.createdAt
                          ? new Date((user || layoutUser).createdAt).toLocaleDateString('id-ID', {
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'N/A'}
                      </span>
                    </div>
                    <div
                      className="flex items-center justify-between p-4 rounded-xl"
                      style={{
                        background: 'rgba(0,245,255,0.03)',
                        border: '1px solid rgba(0,245,255,0.08)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Shield size={18} style={{ color: '#00f5ff' }} />
                        <span className="text-sm text-gray-400">Status</span>
                      </div>
                      <span
                        className="font-semibold px-3 py-1 rounded-full text-xs"
                        style={{
                          background: 'rgba(34,197,94,0.1)',
                          color: '#22c55e',
                          border: '1px solid rgba(34,197,94,0.2)',
                        }}
                      >
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
                  <p className="text-sm text-gray-400 mb-4">
                    Tindakan di bawah tidak dapat dibatalkan.
                  </p>
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
      )}
    </DashboardLayout>
  )
}