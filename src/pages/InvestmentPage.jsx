import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Plus, Pencil, Trash2, DollarSign, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useToast } from '../context/ToastContext'
import api from '../lib/api'

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const INVESTMENT_TYPES = [
  { id: 'stock', label: 'Saham', icon: '📈', color: '#22c55e' },
  { id: 'mutual_fund', label: 'Reksadana', icon: '📊', color: '#06b6d4' },
  { id: 'crypto', label: 'Kripto', icon: '₿', color: '#f97316' },
  { id: 'deposito', label: 'Deposito', icon: '🏦', color: '#a855f7' },
  { id: 'bonds', label: 'Obligasi', icon: '📜', color: '#ec4899' },
  { id: 'other', label: 'Lainnya', icon: '💰', color: '#7aa6c2' },
]

export default function InvestmentPage() {
  const { success, error: showError } = useToast()
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    type: 'stock',
    amount: '',
    currentValue: '',
    purchaseDate: '',
    notes: '',
  })

  const loadInvestments = async () => {
    try {
      setLoading(true)
      const storedUser = localStorage.getItem('fintime_user')
      if (!storedUser) return
      const user = JSON.parse(storedUser)

      const response = await api.get(`/investments/${user.id}`)
      if (response.data?.success) {
        setInvestments(response.data.data || [])
      } else {
        setInvestments(response.data || [])
      }
    } catch (err) {
      console.error('Failed to load investments:', err)
      setInvestments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInvestments()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const storedUser = localStorage.getItem('fintime_user')
      if (!storedUser) return
      const user = JSON.parse(storedUser)

      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        currentValue: parseFloat(formData.currentValue) || parseFloat(formData.amount),
        userId: user.id,
      }

      if (editingId) {
        await api.put(`/investments/${editingId}`, payload)
        success('Investasi berhasil diupdate')
      } else {
        await api.post(`/investments/${user.id}`, payload)
        success('Investasi berhasil ditambahkan')
      }

      setShowForm(false)
      setEditingId(null)
      resetForm()
      loadInvestments()
    } catch (err) {
      console.error('Failed to save investment:', err)
      showError('Gagal menyimpan investasi')
    }
  }

  const handleEdit = (inv) => {
    setFormData({
      name: inv.name || '',
      type: inv.type || 'stock',
      amount: inv.amount?.toString() || '',
      currentValue: inv.currentValue?.toString() || '',
      purchaseDate: inv.purchaseDate?.split('T')[0] || '',
      notes: inv.notes || '',
    })
    setEditingId(inv.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus investasi ini?')) return
    try {
      await api.delete(`/investments/${id}`)
      success('Investasi berhasil dihapus')
      loadInvestments()
    } catch (err) {
      console.error('Failed to delete investment:', err)
      showError('Gagal menghapus investasi')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'stock',
      amount: '',
      currentValue: '',
      purchaseDate: '',
      notes: '',
    })
  }

  // Calculate totals
  const totalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0)
  const totalValue = investments.reduce((sum, inv) => sum + (inv.currentValue || inv.amount || 0), 0)
  const totalGainLoss = totalValue - totalInvested
  const percentChange = totalInvested > 0 ? ((totalGainLoss / totalInvested) * 100) : 0

  return (
    <DashboardLayout activePage="investment" particleCount={20}>
      {({ user }) => (
        <main className="pt-24 px-4 sm:px-6 lg:px-8 relative z-10 pb-24">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 grad-text">
                Portfolio Investasi
              </h1>
              <p className="text-gray-400">
                Lacak dan pantau portofolio investasi Anda
              </p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setEditingId(null)
                setShowForm(true)
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all"
              style={{
                background: 'linear-gradient(135deg, #00f5ff, #0096c7)',
                color: '#020b18',
              }}
            >
              <Plus size={16} />
              Tambah Investasi
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(6,21,40,0.7)',
                border: '1px solid rgba(0,245,255,0.1)',
              }}
            >
              <p className="text-sm mb-2" style={{ color: '#7aa6c2' }}>Total Investasi</p>
              <p className="text-xl font-bold" style={{ color: '#00f5ff' }}>
                {formatCurrency(totalInvested)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(6,21,40,0.7)',
                border: '1px solid rgba(0,245,255,0.1)',
              }}
            >
              <p className="text-sm mb-2" style={{ color: '#7aa6c2' }}>Nilai Saat Ini</p>
              <p className="text-xl font-bold" style={{ color: '#22c55e' }}>
                {formatCurrency(totalValue)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(6,21,40,0.7)',
                border: '1px solid rgba(0,245,255,0.1)',
              }}
            >
              <p className="text-sm mb-2" style={{ color: '#7aa6c2' }}>Profit/Loss</p>
              <p
                className="text-xl font-bold flex items-center gap-2"
                style={{ color: totalGainLoss >= 0 ? '#22c55e' : '#f87171' }}
              >
                {totalGainLoss >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                {formatCurrency(Math.abs(totalGainLoss))}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(6,21,40,0.7)',
                border: '1px solid rgba(0,245,255,0.1)',
              }}
            >
              <p className="text-sm mb-2" style={{ color: '#7aa6c2' }}>Persentase</p>
              <p
                className="text-xl font-bold"
                style={{ color: percentChange >= 0 ? '#22c55e' : '#f87171' }}
              >
                {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%
              </p>
            </motion.div>
          </div>

          {/* Investment List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(6,21,40,0.7)',
              border: '1px solid rgba(0,245,255,0.1)',
            }}
          >
            {loading ? (
              <div className="p-8 text-center">
                <p style={{ color: '#7aa6c2' }}>Memuat...</p>
              </div>
            ) : investments.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-semibold" style={{ color: '#7aa6c2' }}>
                  Belum ada investasi
                </p>
                <p className="text-sm mt-1" style={{ color: '#5a8aab' }}>
                  Tambahkan investasi untuk mulai melacak
                </p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'rgba(0,245,255,0.08)' }}>
                {investments.map((inv) => {
                  const invested = inv.amount || 0
                  const current = inv.currentValue || invested
                  const gainLoss = current - invested
                  const percent = invested > 0 ? (gainLoss / invested) * 100 : 0
                  const typeInfo = INVESTMENT_TYPES.find(t => t.id === inv.type) || INVESTMENT_TYPES[5]

                  return (
                    <div key={inv.id} className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                          style={{
                            background: `${typeInfo.color}15`,
                            border: `1px solid ${typeInfo.color}30`,
                          }}
                        >
                          {typeInfo.icon}
                        </div>
                        <div>
                          <h3 className="font-bold" style={{ color: 'white' }}>
                            {inv.name}
                          </h3>
                          <p className="text-sm" style={{ color: '#7aa6c2' }}>
                            {typeInfo.label} • {inv.purchaseDate ? new Date(inv.purchaseDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : '-'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm" style={{ color: '#7aa6c2' }}>Nilai Saat Ini</p>
                          <p className="font-bold" style={{ color: 'white' }}>
                            {formatCurrency(current)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm" style={{ color: '#7aa6c2' }}>Profit/Loss</p>
                          <p
                            className="font-bold"
                            style={{ color: gainLoss >= 0 ? '#22c55e' : '#f87171' }}
                          >
                            {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss)} ({percent.toFixed(1)}%)
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(inv)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
                            style={{ color: '#7aa6c2' }}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(inv.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-all text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Add/Edit Modal */}
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
                  border: '1px solid rgba(0,245,255,0.2)',
                }}
              >
                <h3 className="text-xl font-bold mb-6">
                  {editingId ? 'Edit Investasi' : 'Tambah Investasi Baru'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                      Nama Investasi
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Contoh: Saham BBCA"
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
                      Jenis
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{
                        background: '#02111f',
                        border: '1px solid rgba(0,245,255,0.15)',
                        color: 'white',
                      }}
                    >
                      {INVESTMENT_TYPES.map((type) => (
                        <option key={type.id} value={type.id}>{type.icon} {type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                        Nilai Awal (Rp)
                      </label>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                        min="1000"
                        placeholder="Contoh: 5000000"
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
                        Nilai Saat Ini (Rp)
                      </label>
                      <input
                        type="number"
                        value={formData.currentValue}
                        onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                        min="0"
                        placeholder="Contoh: 5500000"
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
                      Tanggal Pembelian
                    </label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
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
        </main>
      )}
    </DashboardLayout>
  )
}