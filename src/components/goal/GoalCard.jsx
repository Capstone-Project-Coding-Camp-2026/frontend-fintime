import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Target, Plus, Pencil, Trash2, Calendar, Wallet, Award, CheckCircle, Clock, ChevronDown, History } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import api from '../../lib/api'

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const GOAL_CATEGORIES = [
  { id: 'emergency_fund', label: 'Dana Darurat', icon: '🛡️', color: '#22c55e' },
  { id: 'vacation', label: 'Liburan', icon: '✈️', color: '#06b6d4' },
  { id: 'vehicle', label: 'Kendaraan', icon: '🚗', color: '#a855f7' },
  { id: 'gadget', label: 'Gadget', icon: '📱', color: '#ec4899' },
  { id: 'education', label: 'Pendidikan', icon: '🎓', color: '#f97316' },
  { id: 'wedding', label: 'Pernikahan', icon: '💒', color: '#fbbf24' },
  { id: 'home', label: 'Rumah', icon: '🏠', color: '#14b8a6' },
  { id: 'investment', label: 'Investasi', icon: '📈', color: '#00f5ff' },
  { id: 'other', label: 'Lainnya', icon: '⭐', color: '#7aa6c2' },
]

const getDaysRemaining = (targetDate) => {
  if (!targetDate) return null
  const now = new Date()
  const target = new Date(targetDate)
  const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24))
  return diffDays
}

const getProgressColor = (percent) => {
  if (percent >= 100) return '#22c55e' // green
  if (percent >= 75) return '#00f5ff' // cyan
  if (percent >= 50) return '#fbbf24' // yellow
  return '#f87171' // red
}

export default function GoalCard({ onRefresh }) {
  const { success, error: showError } = useToast()
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showAddSavings, setShowAddSavings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedHistoryGoal, setSelectedHistoryGoal] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'other',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    description: '',
  })

  const [savingsAmount, setSavingsAmount] = useState('')

  const loadGoals = async () => {
    try {
      setLoading(true)
      const storedUser = localStorage.getItem('fintime_user')
      if (!storedUser) return
      const user = JSON.parse(storedUser)

      const response = await api.get(`/goals/${user.id}`)
      if (response.data?.success) {
        setGoals(response.data.data || [])
      } else {
        setGoals(response.data || [])
      }
    } catch (err) {
      console.error('Failed to load goals:', err)
      setGoals([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGoals()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const storedUser = localStorage.getItem('fintime_user')
      if (!storedUser) return
      const user = JSON.parse(storedUser)

      const payload = {
        name: formData.name,
        category: formData.category,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        targetDate: formData.targetDate,
        description: formData.description,
        userId: user.id,
      }

      if (editingId) {
        await api.put(`/goals/${editingId}`, payload)
        success('Target berhasil diupdate')
      } else {
        await api.post(`/goals/${user.id}`, payload)
        success('Target berhasil ditambahkan')
      }

      setShowForm(false)
      setEditingId(null)
      resetForm()
      loadGoals()
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error('Failed to save goal:', err)
      showError('Gagal menyimpan target')
    }
  }

  const handleAddSavings = async (e) => {
    e.preventDefault()
    if (!selectedGoal) return

    try {
      await api.post(`/goals/${selectedGoal.id}/savings`, {
        amount: parseFloat(savingsAmount),
      })
      success('Tabungan berhasil ditambahkan')
      setShowAddSavings(false)
      setSelectedGoal(null)
      setSavingsAmount('')
      loadGoals()
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error('Failed to add savings:', err)
      showError('Gagal menambahkan tabungan')
    }
  }

  const handleEdit = (goal) => {
    setFormData({
      name: goal.name || '',
      category: goal.category || 'other',
      targetAmount: goal.targetAmount?.toString() || '',
      currentAmount: goal.currentAmount?.toString() || '',
      targetDate: goal.targetDate?.split('T')[0] || '',
      description: goal.description || '',
    })
    setEditingId(goal.id)
    setShowForm(true)
  }

  const handleDelete = async (goalId) => {
    if (!confirm('Hapus target ini?')) return
    try {
      await api.delete(`/goals/${goalId}`)
      success('Target berhasil dihapus')
      loadGoals()
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error('Failed to delete goal:', err)
      showError('Gagal menghapus target')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'other',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      description: '',
    })
  }

  // Calculate stats
  const activeGoals = goals.filter(g => {
    const current = g.currentAmount || 0
    const target = g.targetAmount || 1
    return current < target
  })
  const completedGoals = goals.filter(g => {
    const current = g.currentAmount || 0
    const target = g.targetAmount || 1
    return current >= target
  })
  const totalSaved = goals.reduce((sum, g) => sum + (g.currentAmount || 0), 0)
  const totalTarget = goals.reduce((sum, g) => sum + (g.targetAmount || 0), 0)

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(6,21,40,0.7)',
        border: '1px solid rgba(0,245,255,0.1)',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ borderBottom: '1px solid rgba(0,245,255,0.08)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(168,85,247,0.1)' }}
          >
            <Target size={20} style={{ color: '#a855f7' }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'white' }}>
              Target Tabungan
            </h2>
            <p className="text-sm" style={{ color: '#7aa6c2' }}>
              Raih tujuan keuangan Anda
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            resetForm()
            setEditingId(null)
            setShowForm(true)
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl font-semibold transition-all whitespace-nowrap"
          style={{
            background: 'rgba(0,245,255,0.1)',
            border: '1px solid rgba(0,245,255,0.2)',
            color: '#00f5ff',
          }}
        >
          <Plus size={16} />
          Tambah
        </button>
      </div>

      {/* Summary Stats */}
      <div
        className="px-6 py-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4"
        style={{ borderBottom: '1px solid rgba(0,245,255,0.08)' }}
      >
        <div>
          <span className="text-xs" style={{ color: '#7aa6c2' }}>Total Ditabung</span>
          <p className="text-base sm:text-lg font-bold truncate" style={{ color: '#a855f7' }}>
            {formatCurrency(totalSaved)}
          </p>
        </div>
        <div>
          <span className="text-xs" style={{ color: '#7aa6c2' }}>Target Keseluruhan</span>
          <p className="text-base sm:text-lg font-bold truncate" style={{ color: '#00f5ff' }}>
            {formatCurrency(totalTarget)}
          </p>
        </div>
        <div>
          <span className="text-xs" style={{ color: '#7aa6c2' }}>Aktif</span>
          <p className="text-base sm:text-lg font-bold" style={{ color: '#fbbf24' }}>
            {activeGoals.length}
          </p>
        </div>
        <div>
          <span className="text-xs" style={{ color: '#7aa6c2' }}>Selesai</span>
          <p className="text-base sm:text-lg font-bold" style={{ color: '#22c55e' }}>
            {completedGoals.length}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <p className="text-center py-4" style={{ color: '#7aa6c2' }}>Memuat...</p>
        ) : goals.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-semibold" style={{ color: '#7aa6c2' }}>
              Belum ada target
            </p>
            <p className="text-sm mt-1" style={{ color: '#5a8aab' }}>
              Tambahkan target untuk mulai menabung
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const current = goal.currentAmount || 0
              const target = goal.targetAmount || 0
              const percent = target > 0 ? Math.min((current / target) * 100, 100) : 0
              const isCompleted = percent >= 100
              const daysRemaining = getDaysRemaining(goal.targetDate)
              const categoryInfo = GOAL_CATEGORIES.find(c => c.id === goal.category) || GOAL_CATEGORIES[8]

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-4 ${isCompleted ? '' : ''}`}
                  style={{
                    background: isCompleted
                      ? 'rgba(34,197,94,0.05)'
                      : 'rgba(0,245,255,0.03)',
                    border: `1px solid ${
                      isCompleted
                        ? 'rgba(34,197,94,0.2)'
                        : 'rgba(0,245,255,0.08)'
                    }`,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl sm:text-2xl shrink-0">{categoryInfo.icon}</span>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm sm:text-base truncate" style={{ color: 'white' }}>
                          {goal.name || 'Target'}
                        </h3>
                        <p className="text-[11px] sm:text-xs truncate" style={{ color: '#7aa6c2' }}>
                          {categoryInfo.label}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isCompleted ? (
                        <span
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold"
                          style={{
                            background: 'rgba(34,197,94,0.1)',
                            color: '#22c55e',
                          }}
                        >
                          <CheckCircle size={12} />
                          Selesai
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setSelectedHistoryGoal(goal)
                              setShowHistory(true)
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/5 hover:bg-blue-500/10 transition-all"
                            style={{ color: '#3b82f6', border: '1px solid rgba(59,130,246,0.1)' }}
                            title="Riwayat Tabungan"
                          >
                            <History size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedGoal(goal)
                              setSavingsAmount('')
                              setShowAddSavings(true)
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500/5 hover:bg-green-500/10 transition-all"
                            style={{ color: '#22c55e', border: '1px solid rgba(34,197,94,0.1)' }}
                            title="Tambah Tabungan"
                          >
                            <Wallet size={14} />
                          </button>
                          <button
                            onClick={() => handleEdit(goal)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all"
                            style={{ color: '#7aa6c2', border: '1px solid rgba(255,255,255,0.05)' }}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(goal.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/5 hover:bg-red-500/10 transition-all text-red-400"
                            style={{ border: '1px solid rgba(248,113,113,0.1)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[11px] sm:text-sm mb-2">
                      <span style={{ color: '#7aa6c2' }}>
                        {formatCurrency(current)} / {formatCurrency(target)}
                      </span>
                      <span
                        className="font-bold"
                        style={{ color: getProgressColor(percent) }}
                      >
                        {percent.toFixed(0)}%
                      </span>
                    </div>
                    <div
                      className="h-2 sm:h-3 rounded-full overflow-hidden"
                      style={{ background: 'rgba(0,245,255,0.1)' }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: getProgressColor(percent) }}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs">
                    {daysRemaining !== null && (
                      <span
                        className="flex items-center gap-1"
                        style={{
                          color: daysRemaining < 0 ? '#f87171' : daysRemaining <= 30 ? '#fbbf24' : '#7aa6c2',
                        }}
                      >
                        <Clock size={12} />
                        {daysRemaining < 0
                          ? `Terlambat ${Math.abs(daysRemaining)} hari`
                          : daysRemaining === 0
                            ? 'Jatuh tempo hari ini'
                            : `${daysRemaining} hari tersisa`
                        }
                      </span>
                    )}
                    {goal.description && (
                      <span style={{ color: '#5a8aab' }} className="truncate">
                        {goal.description}
                      </span>
                    )}
                  </div>

                  {/* Achieved Badge */}
                  {isCompleted && (
                    <div
                      className="mt-3 flex items-center justify-center gap-2 p-2 rounded-lg"
                      style={{ background: 'rgba(34,197,94,0.1)' }}
                    >
                      <Award size={16} style={{ color: '#22c55e' }} />
                      <span className="text-sm font-semibold" style={{ color: '#22c55e' }}>
                        Target Tercapai!
                      </span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full sm:max-w-md md:max-w-lg rounded-2xl p-4 sm:p-6 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar"
            style={{
              background: 'rgba(6,21,40,0.95)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(0,245,255,0.2)',
            }}
          >
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
              style={{ color: '#7aa6c2' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 pr-8">
              {editingId ? 'Edit Target' : 'Tambah Target Baru'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                  Nama Target
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Contoh: Dana Liburan Jepang"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm sm:text-base"
                  style={{
                    background: '#02111f',
                    border: '1px solid rgba(0,245,255,0.15)',
                    color: 'white',
                  }}
                />
              </div>

              <div className="relative">
               <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                 Kategori
               </label>
               <button
                 type="button"
                 onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                 className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none flex items-center justify-between transition-all text-sm sm:text-base"
                 style={{
                   background: '#02111f',
                   border: '1px solid rgba(0,245,255,0.15)',
                   color: 'white',
                 }}
               >
                 <div className="flex items-center gap-2">
                   <span>{GOAL_CATEGORIES.find(c => c.id === formData.category)?.icon}</span>
                   <span className="truncate">{GOAL_CATEGORIES.find(c => c.id === formData.category)?.label}</span>
                 </div>
                 <ChevronDown
                   size={16}
                   className={`flex-shrink-0 transition-transform duration-300 ${showCategoryDropdown ? 'rotate-180' : ''}`}
                   style={{ color: '#00f5ff' }}
                 />
               </button>

               {showCategoryDropdown && (
                 <>
                   <div
                     className="fixed inset-0 z-[60]"
                     onClick={() => setShowCategoryDropdown(false)}
                   />
                   <motion.div
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="absolute left-0 right-0 mt-2 z-[70] rounded-xl overflow-hidden border shadow-2xl"
                     style={{
                       background: 'rgba(6,21,40,0.98)',
                       backdropFilter: 'blur(10px)',
                       borderColor: 'rgba(0,245,255,0.2)',
                     }}
                   >
                     <div className="max-h-48 sm:max-h-60 overflow-y-auto custom-scrollbar">
                       {GOAL_CATEGORIES.map((cat) => (
                         <button
                           key={cat.id}
                           type="button"
                           onClick={() => {
                             setFormData({ ...formData, category: cat.id })
                             setShowCategoryDropdown(false)
                           }}
                           className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 hover:bg-white/5 transition-all text-left text-sm sm:text-base"
                           style={{
                             color: formData.category === cat.id ? '#00f5ff' : 'white',
                             background: formData.category === cat.id ? 'rgba(0,245,255,0.05)' : 'transparent',
                           }}
                         >
                           <span className="text-lg sm:text-xl">{cat.icon}</span>
                           <span className="font-medium truncate">{cat.label}</span>
                         </button>
                       ))}
                     </div>
                   </motion.div>
                 </>
               )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                    Target Amount (Rp)
                  </label>
                  <input
                    type="text"
                    value={formData.targetAmount ? new Intl.NumberFormat('id-ID').format(formData.targetAmount) : ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      setFormData({ ...formData, targetAmount: val })
                    }}
                    required
                    placeholder="15.000.000"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm sm:text-base"
                    style={{
                      background: '#02111f',
                      border: '1px solid rgba(0,245,255,0.15)',
                      color: 'white',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                    Sudah Tersimpan (Rp)
                  </label>
                  <input
                    type="text"
                    value={formData.currentAmount ? new Intl.NumberFormat('id-ID').format(formData.currentAmount) : ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      setFormData({ ...formData, currentAmount: val })
                    }}
                    placeholder="5.000.000"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm sm:text-base"
                    style={{
                      background: '#02111f',
                      border: '1px solid rgba(0,245,255,0.15)',
                      color: 'white',
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                  Target Tanggal
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm sm:text-base"
                  style={{
                    background: '#02111f',
                    border: '1px solid rgba(0,245,255,0.15)',
                    color: 'white',
                  }}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                  Deskripsi (Opsional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                  placeholder="Catatan tambahan..."
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none resize-none text-sm sm:text-base"
                  style={{
                    background: '#02111f',
                    border: '1px solid rgba(0,245,255,0.15)',
                    color: 'white',
                  }}
                />
              </div>

              <div className="flex items-center gap-2 sm:gap-3 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base"
                  style={{
                    background: 'rgba(248,113,113,0.1)',
                    border: '1px solid rgba(248,113,113,0.2)',
                    color: '#f87171',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base"
                  style={{
                    background: 'linear-gradient(135deg, #00f5ff, #0096c7)',
                    color: '#020b18',
                  }}
                >
                  {editingId ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Savings Modal */}
      {showAddSavings && selectedGoal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddSavings(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full sm:max-w-md rounded-2xl p-4 sm:p-6 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto custom-scrollbar"
            style={{
              background: 'rgba(6,21,40,0.95)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(0,245,255,0.2)',
            }}
          >
            <button
              type="button"
              onClick={() => setShowAddSavings(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
              style={{ color: '#7aa6c2' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h3 className="text-lg sm:text-xl font-bold mb-2 pr-8">Tambah Tabungan</h3>
            <p className="text-sm mb-3 sm:mb-4" style={{ color: '#7aa6c2' }}>
              {selectedGoal.name}
            </p>
            <p className="text-xs mb-4 sm:mb-6" style={{ color: '#5a8aab' }}>
              Progress: {formatCurrency(selectedGoal.currentAmount || 0)} / {formatCurrency(selectedGoal.targetAmount || 0)}
            </p>

            <form onSubmit={handleAddSavings} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                  Jumlah Tabungan (Rp)
                </label>
                <input
                  type="text"
                  value={savingsAmount ? new Intl.NumberFormat('id-ID').format(savingsAmount) : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '')
                    setSavingsAmount(val)
                  }}
                  required
                  placeholder="500.000"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm sm:text-base"
                  style={{
                    background: '#02111f',
                    border: '1px solid rgba(0,245,255,0.15)',
                    color: 'white',
                  }}
                />
              </div>

              <div className="flex items-center gap-2 sm:gap-3 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddSavings(false)}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base"
                  style={{
                    background: 'rgba(248,113,113,0.1)',
                    border: '1px solid rgba(248,113,113,0.2)',
                    color: '#f87171',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                  }}
                >
                  <Wallet size={16} />
                  Simpan
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && selectedHistoryGoal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowHistory(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full sm:max-w-md rounded-2xl p-4 sm:p-6 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto custom-scrollbar"
            style={{
              background: 'rgba(6,21,40,0.95)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(0,245,255,0.2)',
            }}
          >
            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
              style={{ color: '#7aa6c2' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h3 className="text-lg sm:text-xl font-bold mb-2 pr-8">Riwayat Tabungan</h3>
            <p className="text-sm mb-4 sm:mb-6" style={{ color: '#7aa6c2' }}>
              {selectedHistoryGoal.name}
            </p>

            <div className="space-y-3">
              {(!selectedHistoryGoal.savings || selectedHistoryGoal.savings.length === 0) ? (
                <p className="text-center text-sm py-4" style={{ color: '#7aa6c2' }}>
                  Belum ada riwayat tabungan.
                </p>
              ) : (
                selectedHistoryGoal.savings.map((saving, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div>
                      <p className="text-sm font-semibold text-white">{formatCurrency(saving.amount)}</p>
                      <p className="text-xs" style={{ color: '#7aa6c2' }}>{formatDate(saving.savedAt)}</p>
                    </div>
                    {saving.notes && <span className="text-xs" style={{ color: '#5a8aab' }}>{saving.notes}</span>}
                  </div>
                ))
              )}
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="w-full px-4 py-3 rounded-xl font-semibold text-sm sm:text-base"
                style={{
                  background: 'rgba(248,113,113,0.1)',
                  border: '1px solid rgba(248,113,113,0.2)',
                  color: '#f87171',
                }}
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}