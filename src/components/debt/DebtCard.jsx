import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { AlertTriangle, Plus, Pencil, Trash2, Calendar, CreditCard, TrendingDown, CheckCircle } from 'lucide-react'
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

const DEBT_TYPES = [
  { id: 'kpr', label: 'KPR (Rumah)', icon: '🏠' },
  { id: 'vehicle', label: 'Kendaraan', icon: '🚗' },
  { id: 'pinjol', label: 'Pinjaman Online', icon: '📱' },
  { id: 'card', label: 'Kartu Kredit', icon: '💳' },
  { id: 'personal', label: 'Pinjaman Pribadi', icon: '👤' },
  { id: 'other', label: 'Lainnya', icon: '📋' },
]

export default function DebtCard({ onRefresh }) {
  const { success, error: showError, warning } = useToast()
  const [debts, setDebts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedDebt, setSelectedDebt] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'personal',
    totalAmount: '',
    remainingAmount: '',
    interestRate: '',
    tenorMonths: '',
    startDate: '',
    dueDate: '',
    monthlyPayment: '',
    lender: '',
  })

  const [paymentAmount, setPaymentAmount] = useState('')

  const loadDebts = async () => {
    try {
      setLoading(true)
      const storedUser = localStorage.getItem('fintime_user')
      if (!storedUser) return
      const user = JSON.parse(storedUser)

      const response = await api.get(`/debts/${user.id}`)
      if (response.data?.success) {
        setDebts(response.data.data || [])
      } else {
        setDebts(response.data || [])
      }
    } catch (err) {
      console.error('Failed to load debts:', err)
      setDebts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDebts()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const storedUser = localStorage.getItem('fintime_user')
      if (!storedUser) return
      const user = JSON.parse(storedUser)

      const payload = {
        name: formData.name,
        type: formData.type,
        totalAmount: parseFloat(formData.totalAmount),
        remainingAmount: parseFloat(formData.remainingAmount) || parseFloat(formData.totalAmount),
        interestRate: parseFloat(formData.interestRate) || 0,
        tenorMonths: parseInt(formData.tenorMonths) || 12,
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        monthlyPayment: parseFloat(formData.monthlyPayment) || 0,
        lender: formData.lender,
        userId: user.id,
      }

      if (editingId) {
        await api.put(`/debts/${editingId}`, payload)
        success('Hutang berhasil diupdate')
      } else {
        await api.post(`/debts/${user.id}`, payload)
        success('Hutang berhasil ditambahkan')
      }

      setShowForm(false)
      setEditingId(null)
      resetForm()
      loadDebts()
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error('Failed to save debt:', err)
      showError('Gagal menyimpan hutang')
    }
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    if (!selectedDebt) return

    try {
      await api.post(`/debts/${selectedDebt.id}/payments`, {
        amount: parseFloat(paymentAmount),
        date: new Date().toISOString(),
      })

      success('Pembayaran berhasil dicatat')
      setShowPayment(false)
      setSelectedDebt(null)
      setPaymentAmount('')
      loadDebts()
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error('Failed to record payment:', err)
      showError('Gagal mencatat pembayaran')
    }
  }

  const handleEdit = (debt) => {
    setFormData({
      name: debt.name || '',
      type: debt.type || 'personal',
      totalAmount: debt.totalAmount?.toString() || '',
      remainingAmount: debt.remainingAmount?.toString() || '',
      interestRate: debt.interestRate?.toString() || '',
      tenorMonths: debt.tenorMonths?.toString() || '',
      startDate: debt.startDate?.split('T')[0] || '',
      dueDate: debt.dueDate?.split('T')[0] || '',
      monthlyPayment: debt.monthlyPayment?.toString() || '',
      lender: debt.lender || '',
    })
    setEditingId(debt.id)
    setShowForm(true)
  }

  const handleDelete = async (debtId) => {
    if (!confirm('Hapus hutang ini?')) return
    try {
      await api.delete(`/debts/${debtId}`)
      success('Hutang berhasil dihapus')
      loadDebts()
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error('Failed to delete debt:', err)
      showError('Gagal menghapus hutang')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'personal',
      totalAmount: '',
      remainingAmount: '',
      interestRate: '',
      tenorMonths: '',
      startDate: '',
      dueDate: '',
      monthlyPayment: '',
      lender: '',
    })
  }

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null
    const now = new Date()
    const due = new Date(dueDate)
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Calculate totals
  const totalDebt = debts.reduce((sum, d) => sum + (d.remainingAmount || d.totalAmount || 0), 0)
  const totalMonthly = debts.reduce((sum, d) => sum + (d.monthlyPayment || 0), 0)

  // Check for due soon (within 7 days)
  const dueSoonCount = debts.filter(d => {
    const days = getDaysUntilDue(d.dueDate)
    return days !== null && days <= 7 && days >= 0
  }).length

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
            style={{ background: 'rgba(248,113,113,0.1)' }}
          >
            <CreditCard size={20} style={{ color: '#f87171' }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'white' }}>
              Pelacakan Hutang
            </h2>
            <p className="text-sm" style={{ color: '#7aa6c2' }}>
              Kelola dan bayar hutang Anda
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {dueSoonCount > 0 && (
            <span
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(251,191,36,0.1)',
                border: '1px solid rgba(251,191,36,0.2)',
                color: '#fbbf24',
              }}
            >
              <AlertTriangle size={12} />
              {dueSoonCount} Jatuh Tempo
            </span>
          )}
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
      </div>

      {/* Summary Stats */}
      <div
        className="px-6 py-4 flex items-center gap-6"
        style={{ borderBottom: '1px solid rgba(0,245,255,0.08)' }}
      >
        <div>
          <span className="text-xs" style={{ color: '#7aa6c2' }}>Total Hutang</span>
          <p className="text-lg font-bold" style={{ color: '#f87171' }}>
            {formatCurrency(totalDebt)}
          </p>
        </div>
        <div>
          <span className="text-xs" style={{ color: '#7aa6c2' }}>Cicilan/Bulan</span>
          <p className="text-lg font-bold" style={{ color: '#fbbf24' }}>
            {formatCurrency(totalMonthly)}
          </p>
        </div>
        <div>
          <span className="text-xs" style={{ color: '#7aa6c2' }}>Jumlah Hutang</span>
          <p className="text-lg font-bold" style={{ color: '#00f5ff' }}>
            {debts.length}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <p className="text-center py-4" style={{ color: '#7aa6c2' }}>Memuat...</p>
        ) : debts.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-semibold" style={{ color: '#7aa6c2' }}>
              Tidak ada hutang
            </p>
            <p className="text-sm mt-1" style={{ color: '#5a8aab' }}>
              Tambahkan hutang untuk mulai melacak
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {debts.map((debt) => {
              const remaining = debt.remainingAmount || debt.totalAmount || 0
              const original = debt.totalAmount || remaining
              const percent = original > 0 ? ((original - remaining) / original) * 100 : 0
              const daysUntil = getDaysUntilDue(debt.dueDate)
              const typeInfo = DEBT_TYPES.find(t => t.id === debt.type) || DEBT_TYPES[5]

              return (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-4"
                  style={{
                    background: 'rgba(0,245,255,0.03)',
                    border: '1px solid rgba(0,245,255,0.08)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{typeInfo.icon}</span>
                      <div>
                        <h3 className="font-bold" style={{ color: 'white' }}>
                          {debt.name || 'Hutang'}
                        </h3>
                        <p className="text-sm" style={{ color: '#7aa6c2' }}>
                          {typeInfo.label} {debt.lender ? `• ${debt.lender}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedDebt(debt)
                          setPaymentAmount('')
                          setShowPayment(true)
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-green-500/10 transition-all"
                        style={{ color: '#22c55e' }}
                        title="Catat Pembayaran"
                      >
                        <TrendingDown size={14} />
                      </button>
                      <button
                        onClick={() => handleEdit(debt)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
                        style={{ color: '#7aa6c2' }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(debt.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-all text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span style={{ color: '#7aa6c2' }}>
                        Terbayar: {percent.toFixed(0)}%
                      </span>
                      <span style={{ color: '#7aa6c2' }}>
                        Sisa: {formatCurrency(remaining)}
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: 'rgba(0,245,255,0.1)' }}
                    >
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      {debt.monthlyPayment > 0 && (
                        <span style={{ color: '#7aa6c2' }}>
                          Cicilan: <span className="font-semibold" style={{ color: '#fbbf24' }}>
                            {formatCurrency(debt.monthlyPayment)}/bln
                          </span>
                        </span>
                      )}
                      {debt.interestRate > 0 && (
                        <span style={{ color: '#7aa6c2' }}>
                          Bunga: <span className="font-semibold" style={{ color: '#a855f7' }}>
                            {debt.interestRate}%
                          </span>
                        </span>
                      )}
                    </div>
                    {daysUntil !== null && (
                      <span
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold"
                        style={{
                          background: daysUntil <= 7 ? 'rgba(251,191,36,0.1)' : 'rgba(0,245,255,0.08)',
                          color: daysUntil <= 7 ? '#fbbf24' : '#7aa6c2',
                        }}
                      >
                        <Calendar size={12} />
                        {daysUntil < 0
                          ? `Terlambat ${Math.abs(daysUntil)} hari`
                          : daysUntil === 0
                            ? 'Jatuh tempo hari ini'
                            : `Jatuh tempo ${daysUntil} hari lagi`
                        }
                      </span>
                    )}
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
            className="relative w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            style={{
              background: 'rgba(6,21,40,0.95)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(0,245,255,0.2)',
            }}
          >
            <h3 className="text-xl font-bold mb-6">
              {editingId ? 'Edit Hutang' : 'Tambah Hutang Baru'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                    Nama Hutang
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Contoh: Cicilan Motor"
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
                    {DEBT_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                    Lender / Pemberi Pinjaman
                  </label>
                  <input
                    type="text"
                    value={formData.lender}
                    onChange={(e) => setFormData({ ...formData, lender: e.target.value })}
                    placeholder="Contoh: BCA Finance"
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
                    Total Pinjaman (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    required
                    min="1000"
                    placeholder="Contoh: 25000000"
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
                    Sisa Hutang (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.remainingAmount}
                    onChange={(e) => setFormData({ ...formData, remainingAmount: e.target.value })}
                    min="0"
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
                    Bunga (%/tahun)
                  </label>
                  <input
                    type="number"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="Contoh: 12"
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
                    Tenor (bulan)
                  </label>
                  <input
                    type="number"
                    value={formData.tenorMonths}
                    onChange={(e) => setFormData({ ...formData, tenorMonths: e.target.value })}
                    min="1"
                    placeholder="Contoh: 36"
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
                    Cicilan/Bulan (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyPayment}
                    onChange={(e) => setFormData({ ...formData, monthlyPayment: e.target.value })}
                    min="0"
                    placeholder="Contoh: 800000"
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
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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
                    Tanggal Jatuh Tempo
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{
                      background: '#02111f',
                      border: '1px solid rgba(0,245,255,0.15)',
                      color: 'white',
                    }}
                  />
                </div>
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

      {/* Payment Modal */}
      {showPayment && selectedDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPayment(false)}
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
            <h3 className="text-xl font-bold mb-2">Catat Pembayaran</h3>
            <p className="text-sm mb-6" style={{ color: '#7aa6c2' }}>
              {selectedDebt.name} • Sisa: {formatCurrency(selectedDebt.remainingAmount || 0)}
            </p>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#7aa6c2' }}>
                  Jumlah Pembayaran (Rp)
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                  min="1000"
                  max={selectedDebt.remainingAmount}
                  placeholder="Contoh: 800000"
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
                  onClick={() => setShowPayment(false)}
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
                  <CheckCircle size={16} />
                  Bayar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}