import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDownRight, ArrowUpRight, ChevronDown, ChevronUp, Filter,
  Home, UtensilsCrossed, Car, Film, Pill, GraduationCap,
  ShoppingBag, FileText, Package,
  DollarSign, Briefcase, TrendingUp, Gift
} from 'lucide-react'
import api from '../../lib/api'

const CATEGORY_LABELS = {
  perumahan: 'Perumahan', makanan: 'Makanan', transport: 'Transport',
  hiburan: 'Hiburan', kesehatan: 'Kesehatan', pendidikan: 'Pendidikan',
  belanja: 'Belanja', tagihan: 'Tagihan', gaji: 'Gaji',
  investasi: 'Investasi', freelance: 'Freelance', hadiah: 'Hadiah', lainnya: 'Lainnya'
}

const CATEGORY_ICON_MAP = {
  perumahan: Home,
  makanan: UtensilsCrossed,
  transport: Car,
  hiburan: Film,
  kesehatan: Pill,
  pendidikan: GraduationCap,
  belanja: ShoppingBag,
  tagihan: FileText,
  gaji: DollarSign,
  investasi: TrendingUp,
  freelance: Briefcase,
  hadiah: Gift,
  lainnya: Package
}

export default function TransactionCard({ userId, onAddNew }) {
  const [transactions, setTransactions] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      loadTransactions()
    }
  }, [userId])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/transactions/${userId}?limit=50`)
      setTransactions(response.data.data || [])
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (num) => {
    return num.toLocaleString('id-ID')
  }

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true
    return tx.transactionType === (filter === 'income' ? 'credit' : 'debit')
  })

  const displayedTransactions = showAll ? filteredTransactions : filteredTransactions.slice(0, 5)

  const totalIncome = transactions
    .filter(tx => tx.transactionType === 'credit')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalExpense = transactions
    .filter(tx => tx.transactionType === 'debit')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const balance = totalIncome - totalExpense

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diff === 0) return 'Hari ini'
    if (diff === 1) return 'Kemarin'
    if (diff < 7) return `${diff} hari lalu`
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(6, 21, 40, 0.95), rgba(2, 11, 24, 0.95))',
        border: '1px solid rgba(0, 245, 255, 0.1)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(0, 245, 255, 0.08)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Filter size={20} style={{ color: '#a855f7' }} />
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--text)' }}>Transaksi Terbaru</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{transactions.length} transaksi</p>
          </div>
        </div>
        <button
          onClick={onAddNew}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{ background: 'linear-gradient(135deg, #00f5ff, #0096c7)', color: '#020b18' }}
        >
          + Tambah
        </button>
      </div>

      {/* Summary Stats */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-3 divide-x" style={{ background: 'rgba(0, 245, 255, 0.03)', borderBottom: '1px solid rgba(0, 245, 255, 0.08)' }}>
          <div className="p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Pemasukan</p>
            <p className="font-semibold text-sm" style={{ color: '#4ade80' }}>+Rp {formatCurrency(totalIncome)}</p>
          </div>
          <div className="p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Pengeluaran</p>
            <p className="font-semibold text-sm" style={{ color: '#f87171' }}>-Rp {formatCurrency(totalExpense)}</p>
          </div>
          <div className="p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Saldo</p>
            <p className="font-semibold text-sm" style={{ color: balance >= 0 ? '#00f5ff' : '#f87171' }}>
              {balance >= 0 ? '+' : '-'}Rp {formatCurrency(Math.abs(balance))}
            </p>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      {transactions.length > 0 && (
        <div className="flex gap-2 p-3" style={{ borderBottom: '1px solid rgba(0, 245, 255, 0.08)' }}>
          <button
            onClick={() => setFilter('all')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={
              filter === 'all'
                ? { background: 'rgba(0, 245, 255, 0.15)', color: '#00f5ff', border: '1px solid rgba(0, 245, 255, 0.3)' }
                : { background: 'rgba(0, 245, 255, 0.05)', color: 'var(--text-muted)', border: '1px solid rgba(0, 245, 255, 0.1)' }
            }
          >
            Semua
          </button>
          <button
            onClick={() => setFilter('income')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={
              filter === 'income'
                ? { background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.3)' }
                : { background: 'rgba(0, 245, 255, 0.05)', color: 'var(--text-muted)', border: '1px solid rgba(0, 245, 255, 0.1)' }
            }
          >
            Masuk
          </button>
          <button
            onClick={() => setFilter('expense')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={
              filter === 'expense'
                ? { background: 'rgba(248, 113, 113, 0.15)', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.3)' }
                : { background: 'rgba(0, 245, 255, 0.05)', color: 'var(--text-muted)', border: '1px solid rgba(0, 245, 255, 0.1)' }
            }
          >
            Keluar
          </button>
        </div>
      )}

      {/* Transaction List */}
      <div className="p-5 pt-3 space-y-3 max-h-[350px] overflow-y-auto">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Memuat...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <ArrowDownRight size={32} className="mx-auto mb-3" style={{ color: 'var(--text-dim)', opacity: 0.5 }} />
            <p className="text-sm mb-3" style={{ color: 'var(--text-dim)' }}>Belum ada transaksi</p>
            <button
              onClick={onAddNew}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: 'rgba(0, 245, 255, 0.1)', color: '#00f5ff', border: '1px solid rgba(0, 245, 255, 0.2)' }}
            >
              Catat Transaksi
            </button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
              Tidak ada transaksi {filter === 'income' ? 'masuk' : filter === 'expense' ? 'keluar' : ''}
            </p>
          </div>
        ) : (
          <>
            {displayedTransactions.map((tx) => {
              const IconComponent = CATEGORY_ICON_MAP[tx.categoryLabel] || Package
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{
                    background: 'rgba(0, 245, 255, 0.03)',
                    border: '1px solid rgba(0, 245, 255, 0.08)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: tx.transactionType === 'credit' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                      }}
                    >
                      <IconComponent size={18} style={{ color: tx.transactionType === 'credit' ? '#4ade80' : '#f87171' }} />
                    </div>
                    <div>
                      <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>
                        {CATEGORY_LABELS[tx.categoryLabel] || tx.categoryLabel || 'Lainnya'}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {tx.description || 'Tanpa deskripsi'} • {formatDate(tx.dateTime)}
                      </p>
                    </div>
                  </div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: tx.transactionType === 'credit' ? '#4ade80' : '#f87171' }}
                  >
                    {tx.transactionType === 'credit' ? '+' : '-'}Rp {formatCurrency(tx.amount)}
                  </p>
                </motion.div>
              )
            })}

            {filteredTransactions.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(0, 245, 255, 0.02)',
                  border: '1px solid rgba(0, 245, 255, 0.08)',
                  color: 'var(--text-muted)',
                }}
              >
                {showAll ? (
                  <>
                    <ChevronUp size={14} />
                    Tampilkan Lebih Sedikit
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    Lihat Semua ({filteredTransactions.length})
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}