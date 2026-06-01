import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Repeat, Plus, Pencil, Trash2, Calendar, Clock, Check, X } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useToast } from '../context/ToastContext'
import api from '../lib/api'
import { useConfirm } from '../context/ConfirmContext';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const FREQUENCIES = [
  { id: 'daily', label: 'Harian' },
  { id: 'weekly', label: 'Mingguan' },
  { id: 'monthly', label: 'Bulanan' },
  { id: 'yearly', label: 'Tahunan' },
]

export default function RecurringPage() {
  const { success, error: showError } = useToast()
  const { confirm } = useConfirm();
  const [recurring, setRecurring] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    amount: '',
    category: 'lainnya',
    frequency: 'monthly',
    startDate: '',
    notes: '',
  })

  const categories = [
    'makan', 'transportasi', 'belanja', 'hiburan', 'kesehatan',
    'pendidikan', 'listrik', 'internet', 'langganan', 'lainnya'
  ]

  const loadRecurring = async () => {
    try {
      setLoading(true)
      const storedUser = localStorage.getItem('fintime_user')
      if (!storedUser) return
      const user = JSON.parse(storedUser)

      const response = await api.get(`/recurring/${user.id}`)
      if (response.data?.success) {
        setRecurring(response.data.data || [])
      } else {
        setRecurring(response.data || [])
      }
    } catch (err) {
      console.error('Failed to load recurring:', err)
      setRecurring([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecurring()
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
        userId: user.id,
      }

      if (editingId) {
        await api.put(`/recurring/${editingId}`, payload)
        success('Transaksi berulang berhasil diupdate')
      } else {
        await api.post(`/recurring/${user.id}`, payload)
        success('Transaksi berulang berhasil ditambahkan')
      }

      setShowForm(false)
      setEditingId(null)
      resetForm()
      loadRecurring()
    } catch (err) {
      console.error('Failed to save recurring:', err)
      showError(err.response?.data?.message || 'Gagal menyimpan transaksi berulang')
    }
  }

  const handleEdit = async (item) => {
    setFormData({
      name: item.name || '',
      type: item.type || 'expense',
      amount: item.amount?.toString() || '',
      category: item.category || 'lainnya',
      frequency: item.frequency || 'monthly',
      startDate: item.startDate?.split('T')[0] || '',
      notes: item.notes || '',
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!await confirm('Hapus transaksi berulang ini?')) return
    try {
      await api.delete(`/recurring/${id}`)
      success('Transaksi berulang berhasil dihapus')
      loadRecurring()
    } catch (err) {
      console.error('Failed to delete recurring:', err)
      showError(err.response?.data?.message || 'Gagal menghapus transaksi berulang')
    }
  }

  const toggleActive = async (id, currentStatus) => {
    try {
      await api.put(`/recurring/${id}`, { active: !currentStatus })
      success(`Transaksi ${currentStatus ? 'dinonaktifkan' : 'diaktifkan'}`)
      loadRecurring()
    } catch (err) {
      console.error('Failed to toggle recurring:', err)
      showError(err.response?.data?.message || 'Gagal mengubah status')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'expense',
      amount: '',
      category: 'lainnya',
      frequency: 'monthly',
      startDate: '',
      notes: '',
    })
  }

  const getNextDate = (item) => {
    if (!item.nextDate) return '-'
    return new Date(item.nextDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // Calculate monthly total
  const getMonthlyTotal = () => {
    return recurring.reduce((sum, item) => {
      if (!item.active) return sum
      const amount = item.amount || 0
      switch (item.frequency) {
        case 'daily': return sum + (amount * 30)
        case 'weekly': return sum + (amount * 4)
        case 'monthly': return sum + amount
        case 'yearly': return sum + (amount / 12)
        default: return sum + amount
      }
    }, 0)
  }

  return (
    <DashboardLayout activePage="recurring" particleCount={20}>
      {({ user }) => (
        <main className="pt-24 px-4 sm:px-6 lg:px-8 relative z-10 pb-24">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 grad-text">
                Transaksi Berulang
              </h1>
              <p className="text-gray-400">
                Kelola tagihan dan transaksi otomatis
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
              Tambah Baru
            </button>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 mb-8"
            style={{
              background: 'rgba(6,21,40,0.7)',
              border: '1px solid rgba(0,245,255,0.1)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: '#7aa6c2' }}>Total Bulanan</p>
                <p className="text-2xl font-bold" style={{ color: '#00f5ff' }}>
                  {formatCurrency(getMonthlyTotal())}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: '#22c55e' }}>
                    {recurring.filter(r => r.active).length}
                  </p>
                  <p className="text-xs" style={{ color: '#7aa6c2' }}>Aktif</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: '#f87171' }}>
                    {recurring.filter(r => !r.active).length}
                  </p>
                  <p className="text-xs" style={{ color: '#7aa6c2' }}>Nonaktif</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
            ) : recurring.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-semibold" style={{ color: '#7aa6c2' }}>
                  Belum ada transaksi berulang
                </p>
                <p className="text-sm mt-1" style={{ color: '#5a8aab' }}>
                  Tambahkan untuk otomatis mencatat transaksi rutin
                </p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'rgba(0,245,255,0.08)' }}>
                {recurring.map((item) => {
                  const freqInfo = FREQUENCIES.find(f => f.id === item.frequency) || FREQUENCIES[2]

                  return (
                    <div key={item.id} className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              item.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'
                            }`}
                          >
                            <Repeat size={20} style={{ color: item.type === 'income' ? '#22c55e' : '#f87171' }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold" style={{ color: 'white' }}>
                                {item.name}
                              </h3>
                              <span
                                className="px-2 py-0.5 rounded-lg text-xs font-medium"
                                style={{
                                  background: item.active ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)',
                                  color: item.active ? '#22c55e' : '#f87171',
                                }}
                              >
                                {item.active ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </div>
                            <p className="text-sm" style={{ color: '#7aa6c2' }}>
                              {freqInfo.label} â€¢ {item.category || 'lainnya'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p
                              className="font-bold"
                              style={{ color: item.type === 'income' ? '#22c55e' : '#f87171' }}
                            >
                              {item.type === 'income' ? '+' : '-'}
                              {formatCurrency(item.amount || 0)}
                            </p>
                            <p className="text-xs flex items-center gap-1" style={{ color: '#7aa6c2' }}>
                              <Calendar size={12} />
                              Next: {getNextDate(item)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleActive(item.id, item.active)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                item.active
                                  ? 'hover:bg-red-500/10'
                                  : 'hover:bg-green-500/10'
                              }`}
                              style={{ color: item.active ? '#f87171' : '#22c55e' }}
                              title={item.active ? 'Nonaktifkan' : 'Aktifkan'}
                            >
                              {item.active ? <X size={14} /> : <Check size={14} />}
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
                              style={{ color: '#7aa6c2' }}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-all text-red-400"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {item.notes && (
                        <p className="mt-2 text-sm" style={{ color: '#5a8aab' }}>
                          {item.notes}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Modal */}
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
                  {editingId ? 'Edit Transaksi Berulang' : 'Tambah Transaksi Berulang'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                      Nama Transaksi
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Contoh: Langganan Netflix"
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{
                        background: '#02111f',
                        border: '1px solid rgba(0,245,255,0.15)',
                        color: 'white',
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                        Tipe
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
                        <option value="expense">Pengeluaran</option>
                        <option value="income">Pendapatan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                        Frekuensi
                      </label>
                      <select
                        value={formData.frequency}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl outline-none"
                        style={{
                          background: '#02111f',
                          border: '1px solid rgba(0,245,255,0.15)',
                          color: 'white',
                        }}
                      >
                        {FREQUENCIES.map((f) => (
                          <option key={f.id} value={f.id}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                        Jumlah (Rp)
                      </label>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                        min="1000"
                        placeholder="Contoh: 150000"
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
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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
                      Catatan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Contoh: Bayar tiap tanggal 1"
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

