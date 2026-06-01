import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Plus, Pencil, Trash2, AlertTriangle, Check, ChevronDown } from 'lucide-react'
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

const getProgressColor = (percent) => {
  if (percent >= 90) return '#f87171' // red
  if (percent >= 75) return '#fbbf24' // yellow
  return '#22c55e' // green
}

export default function BudgetCard({ onRefresh }) {
  const { success, error: showError, warning } = useToast()
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    period: 'monthly',
  })

  const categories = [
    'makan', 'transportasi', 'belanja', 'hiburan', 'kesehatan',
    'pendidikan', 'listrik', 'internet', 'langganan', 'lainnya'
  ]

  const loadBudgets = async () => {
    try {
      setLoading(true)
      const storedUser = localStorage.getItem('fintime_user')
      if (!storedUser) return
      const user = JSON.parse(storedUser)

      const response = await api.get(`/budgets/${user.id}`)
      if (response.data?.success) {
        setBudgets(response.data.data || [])
      } else {
        setBudgets(response.data || [])
      }
    } catch (err) {
      console.error('Failed to load budgets:', err)
      // Use mock data if backend doesn't exist
      setBudgets([])
    } finally {
      setLoading(false)
    }
  }

  // Load on mount
  useEffect(() => {
    loadBudgets()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const storedUser = localStorage.getItem('fintime_user')
      if (!storedUser) {
        setIsSubmitting(false)
        return
      }
      const user = JSON.parse(storedUser)

      const payload = {
        category: formData.category,
        limit: parseFloat(formData.limit),
        period: formData.period,
        userId: user.id,
      }

      if (editingId) {
        await api.put(`/budgets/${editingId}`, payload)
        success('Budget berhasil diupdate')
      } else {
        await api.post(`/budgets/${user.id}`, payload)
        success('Budget berhasil dibuat')
      }

      setShowForm(false)
      setEditingId(null)
      setFormData({ category: '', limit: '', period: 'monthly' })
      loadBudgets()
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error('Failed to save budget:', err)
      showError('Gagal menyimpan budget')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (budget) => {
    setFormData({
      category: budget.category,
      limit: budget.limit?.toString() || '',
      period: budget.period || 'monthly',
    })
    setEditingId(budget.id)
    setShowForm(true)
  }

  const handleDelete = async (budgetId) => {
    if (!confirm('Hapus budget ini?')) return
    try {
      setDeletingId(budgetId)
      await api.delete(`/budgets/${budgetId}`)
      success('Budget berhasil dihapus')
      loadBudgets()
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error('Failed to delete budget:', err)
      showError('Gagal menghapus budget')
    } finally {
      setDeletingId(null)
    }
  }

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
            style={{ background: 'rgba(251,191,36,0.1)' }}
          >
            <TrendingUp size={20} style={{ color: '#fbbf24' }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'white' }}>
              Budget Bulanan
            </h2>
            <p className="text-sm" style={{ color: '#7aa6c2' }}>
              Atur limit pengeluaran per kategori
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setFormData({ category: '', limit: '', period: 'monthly' })
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

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <p className="text-center py-4" style={{ color: '#7aa6c2' }}>Memuat...</p>
        ) : budgets.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-semibold" style={{ color: '#7aa6c2' }}>
              Belum ada budget
            </p>
            <p className="text-sm mt-1" style={{ color: '#5a8aab' }}>
              Tambahkan budget untuk mulai melacak pengeluaran
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const spent = budget.spent || 0
              const limit = budget.limit || 0
              const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
              const remaining = limit - spent
              const isOver = remaining < 0
              const progressColor = getProgressColor(percent)

              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-4"
                  style={{
                    background: 'rgba(0,245,255,0.03)',
                    border: '1px solid rgba(0,245,255,0.08)',
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span
                        className="px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap"
                        style={{
                          background: 'rgba(0,245,255,0.1)',
                          color: '#00f5ff',
                        }}
                      >
                        {budget.category || 'lainnya'}
                      </span>
                      {isOver && (
                        <span
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-semibold"
                          style={{
                            background: 'rgba(248,113,113,0.1)',
                            color: '#f87171',
                          }}
                        >
                          <AlertTriangle size={12} />
                          Over Budget
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all"
                        style={{ color: '#7aa6c2', border: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        disabled={deletingId === budget.id}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/5 hover:bg-red-500/10 transition-all text-red-400"
                        style={{ border: '1px solid rgba(248,113,113,0.1)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: 'rgba(0,245,255,0.1)' }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: progressColor }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span style={{ color: '#7aa6c2' }}>Terpakai: </span>
                      <span className="font-bold" style={{ color: 'white' }}>
                        {formatCurrency(spent)}
                      </span>
                      <span style={{ color: '#5a8aab' }}> / {formatCurrency(limit)}</span>
                    </div>
                    <div>
                      <span style={{ color: '#7aa6c2' }}>
                        {isOver ? 'Melebihi: ' : 'Sisa: '}
                      </span>
                      <span
                        className="font-bold"
                        style={{ color: isOver ? '#f87171' : '#22c55e' }}
                      >
                        {formatCurrency(Math.abs(remaining))}
                      </span>
                    </div>
                  </div>
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
              {editingId ? 'Edit Budget' : 'Tambah Budget'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                  Kategori
                </label>
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full px-4 py-3 rounded-xl outline-none flex items-center justify-between transition-all"
                  style={{
                    background: '#02111f',
                    border: '1px solid rgba(0,245,255,0.15)',
                    color: 'white',
                  }}
                >
                  <span className={!formData.category ? 'text-gray-500' : ''}>
                    {formData.category 
                      ? formData.category.charAt(0).toUpperCase() + formData.category.slice(1)
                      : 'Pilih Kategori'}
                  </span>
                  <ChevronDown 
                    size={18} 
                    className={`transition-transform duration-300 ${showCategoryDropdown ? 'rotate-180' : ''}`} 
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
                      <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, category: cat })
                              setShowCategoryDropdown(false)
                            }}
                            className="w-full px-4 py-3 hover:bg-white/5 transition-all text-left"
                            style={{
                              color: formData.category === cat ? '#00f5ff' : 'white',
                              background: formData.category === cat ? 'rgba(0,245,255,0.05)' : 'transparent',
                            }}
                          >
                            <span className="font-medium">
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                  Limit Budget (Rp)
                </label>
                <input
                  type="text"
                  value={formData.limit ? new Intl.NumberFormat('id-ID').format(formData.limit) : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '')
                    setFormData({ ...formData, limit: val })
                  }}
                  required
                  placeholder="Contoh: 500.000"
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
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: isSubmitting ? 'rgba(0, 245, 255, 0.5)' : 'linear-gradient(135deg, #00f5ff, #0096c7)',
                    color: '#020b18',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                        <span className="block w-4 h-4 border-2 border-[#020b18] border-t-transparent rounded-full" />
                      </motion.div>
                      Menyimpan...
                    </>
                  ) : (
                    editingId ? 'Update' : 'Simpan'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}