import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Target, Plus, Pencil, Trash2, Calendar, TrendingUp, Award, CheckCircle, Clock } from 'lucide-react'
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
  const [editingId, setEditingId] = useState(null)
  const [selectedGoal, setSelectedGoal] = useState(null)

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
        className="px-6 py-5 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(0,245,255,0.08)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
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
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all"
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
        className="px-6 py-4 flex items-center gap-6"
        style={{ borderBottom: '1px solid rgba(0,245,255,0.08)' }}
      >
        <div>
          <span className="text-xs" style={{ color: '#7aa6c2' }}>Total Ditabung</span>
          <p className="text-lg font-bold" style={{ color: '#a855f7' }}>
            {formatCurrency(totalSaved)}
          </p>
        </div>
        <div>
          <span className="text-xs" style={{ color: '#7aa6c2' }}>Target Keseluruhan</span>
          <p className="text-lg font-bold" style={{ color: '#00f5ff' }}>
            {formatCurrency(totalTarget)}
          </p>
        </div>
        <div>
          <span className="text-xs" style={{ color: '#7aa6c2' }}>Aktif</span>
          <p className="text-lg font-bold" style={{ color: '#fbbf24' }}>
            {activeGoals.length}
          </p>
        </div>
        <div>
          <span className="text-xs" style={{ color: '#7aa6c2' }}>Selesai</span>
          <p className="text-lg font-bold" style={{ color: '#22c55e' }}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{categoryInfo.icon}</span>
                      <div>
                        <h3 className="font-bold" style={{ color: 'white' }}>
                          {goal.name || 'Target'}
                        </h3>
                        <p className="text-xs" style={{ color: '#7aa6c2' }}>
                          {categoryInfo.label}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
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
                              setSelectedGoal(goal)
                              setSavingsAmount('')
                              setShowAddSavings(true)
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-green-500/10 transition-all"
                            style={{ color: '#22c55e' }}
                            title="Tambah Tabungan"
                          >
                            <TrendingUp size={14} />
                          </button>
                          <button
                            onClick={() => handleEdit(goal)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
                            style={{ color: '#7aa6c2' }}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(goal.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-all text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-2">
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
                      className="h-3 rounded-full overflow-hidden"
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
                  <div className="flex items-center justify-between text-xs">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md rounded-2xl p-6"
            style={{
              background: 'rgba(6,21,40,0.95)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(0,245,255,0.2)',
            }}
          >
            <h3 className="text-xl font-bold mb-6">
              {editingId ? 'Edit Target' : 'Tambah Target Baru'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                  Nama Target
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Contoh: Dana Liburan Jepang"
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{
                    background: '#02111f',
                    border: '1px solid rgba(0,245,255,0.15)',
                    color: 'white',
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{
                    background: '#02111f',
                    border: '1px solid rgba(0,245,255,0.15)',
                    color: 'white',
                  }}
                >
                  {GOAL_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                    Target Amount (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    required
                    min="1000"
                    placeholder="Contoh: 15000000"
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{
                      background: '#02111f',
                      border: '1px solid rgba(0,245,255,0.15)',
                      color: 'white',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                    Sudah Tersimpan (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    min="0"
                    placeholder="Contoh: 5000000"
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{
                      background: '#02111f',
                      border: '1px solid rgba(0,245,255,0.15)',
                      color: 'white',
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                  Target Tanggal
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{
                    background: '#02111f',
                    border: '1px solid rgba(0,245,255,0.15)',
                    color: 'white',
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                  Deskripsi (Opsional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                  placeholder="Catatan tambahan..."
                  className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                  style={{
                    background: '#02111f',
                    border: '1px solid rgba(0,245,255,0.15)',
                    color: 'white',
                  }}
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold"
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
                  className="flex-1 px-4 py-3 rounded-xl font-semibold"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddSavings(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md rounded-2xl p-6"
            style={{
              background: 'rgba(6,21,40,0.95)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(0,245,255,0.2)',
            }}
          >
            <h3 className="text-xl font-bold mb-2">Tambah Tabungan</h3>
            <p className="text-sm mb-4" style={{ color: '#7aa6c2' }}>
              {selectedGoal.name}
            </p>
            <p className="text-xs mb-6" style={{ color: '#5a8aab' }}>
              Progress: {formatCurrency(selectedGoal.currentAmount || 0)} / {formatCurrency(selectedGoal.targetAmount || 0)}
            </p>

            <form onSubmit={handleAddSavings} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                  Jumlah Tabungan (Rp)
                </label>
                <input
                  type="number"
                  value={savingsAmount}
                  onChange={(e) => setSavingsAmount(e.target.value)}
                  required
                  min="1000"
                  placeholder="Contoh: 500000"
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{
                    background: '#02111f',
                    border: '1px solid rgba(0,245,255,0.15)',
                    color: 'white',
                  }}
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddSavings(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold"
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
                  className="flex-1 px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                  }}
                >
                  <TrendingUp size={16} />
                  Simpan
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}