import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CATEGORY_LABELS,
  CATEGORY_ICON_MAP,
  CATEGORY_COLORS,
  TRANSACTION_FILTERS,
  LEDGER_FILTERS,
  ALL_CATEGORIES,
} from './dashboardConstants'

import {
  getUnlabelledTransactions,
  relabelTransaction,
} from '../../lib/transactionApi'
import { BookOpen, Filter } from 'lucide-react'
import api from '../../lib/api'
import TransactionView from './TransactionView'
import LedgerView from './LedgerView'

export default function TransactionCard({ userId, onAddNew, onRefresh }) {
  const [transactions, setTransactions] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [transactionFilter, setTransactionFilter] = useState('all')
  const [ledgerFilter, setLedgerFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('transactions')
  const [unlabelledTx, setUnlabelledTx] = useState([])
  const [unlabelledLoading, setUnlabelledLoading] = useState(false)
  const [savingId, setSavingId] = useState(null)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    if (userId) {
      loadTransactions()
      loadUnlabelledCount()
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

  const loadUnlabelledCount = async () => {
    try {
      const response = await getUnlabelledTransactions(userId)

      const data = response.data || []

      setPendingCount(data.length)
    } catch (error) {
      console.error('Error loading unlabelled count:', error)
    }
  }

  const loadUnlabelledTransactions = async () => {
    try {
      setUnlabelledLoading(true)

      const response = await getUnlabelledTransactions(userId)

      setUnlabelledTx(response.data || [])

      setPendingCount((response.data || []).length)
    } catch (error) {
      console.error('Error loading unlabelled:', error)
    } finally {
      setUnlabelledLoading(false)
    }
  }

  const handleToggleLedger = () => {
    if (viewMode === 'transactions') {
      setViewMode('ledger')
      loadUnlabelledTransactions()
    } else {
      setViewMode('transactions')
      loadTransactions()
    }
  }

  const handleRelabel = async (transactionId, categoryLabel) => {
    try {
      setSavingId(transactionId)

      const result = await relabelTransaction(transactionId, categoryLabel)
      console.log('RELABEL RESULT:', result)

      // refresh semua data
      await loadTransactions()
      await loadUnlabelledTransactions()

      if (onRefresh) {
        await onRefresh()
      }
    } catch (error) {
      console.error('Failed to relabel:', error)
    } finally {
      setSavingId(null)
    }
  }

  const formatCurrency = (num) => {
    return num.toLocaleString('id-ID')
  }

  const filteredTransactions = transactions.filter((tx) => {
    if (transactionFilter === 'all') return true

    if (transactionFilter === 'income') {
      return tx.transactionType === 'credit'
    }

    if (transactionFilter === 'expense') {
      return tx.transactionType === 'debit'
    }

    return true
  })

  const ledgerTransactionsSource =
    ledgerFilter === 'all'
      ? unlabelledTx
      : unlabelledTx.filter(
          (tx) =>
            (tx.categoryLabel || 'lainnya').toLowerCase().trim() ===
            ledgerFilter,
        )

  const displayedTransactions = showAll
    ? filteredTransactions
    : filteredTransactions.slice(0, 5)

  const totalIncome = transactions
    .filter((tx) => tx.transactionType === 'credit')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalExpense = transactions
    .filter((tx) => tx.transactionType === 'debit')
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
        background:
          'linear-gradient(135deg, rgba(6, 21, 40, 0.95), rgba(2, 11, 24, 0.95))',
        border: '1px solid rgba(0, 245, 255, 0.1)',
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 border-b"
        style={{ borderColor: 'rgba(0, 245, 255, 0.08)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center"
            style={{
              background:
                viewMode === 'ledger'
                  ? 'rgba(249, 115, 22, 0.1)'
                  : 'rgba(168, 85, 247, 0.1)',
            }}
          >
            {viewMode === 'ledger' ? (
              <BookOpen size={20} style={{ color: '#f97316' }} />
            ) : (
              <Filter size={20} style={{ color: '#a855f7' }} />
            )}
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--text)' }}>
              {viewMode === 'ledger' ? 'Smart Ledger' : 'Transaksi Terbaru'}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {viewMode === 'ledger'
                ? unlabelledTx.length
                : transactions.length}{' '}
              transaksi
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddNew}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: 'linear-gradient(135deg, #00f5ff, #0096c7)',
              color: '#020b18',
            }}
          >
            + Tambah
          </button>
          <button
            onClick={handleToggleLedger}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 relative"
            style={
              viewMode === 'ledger'
                ? {
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: '#fff',
                  }
                : {
                    background: 'rgba(249, 115, 22, 0.12)',
                    color: '#f97316',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                  }
            }
          >
            <span className="flex items-center gap-1.5">
              <BookOpen size={13} />
              Smart Ledger
            </span>

            {pendingCount > 0 && viewMode !== 'ledger' && (
              <span
                className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  background: '#ef4444',
                  color: '#fff',
                }}
              >
                {pendingCount > 99 ? '99+' : pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {viewMode === 'transactions' ? (
          <TransactionView
            transactions={transactions}
            loading={loading}
            showAll={showAll}
            setShowAll={setShowAll}
            transactionFilter={transactionFilter}
            setTransactionFilter={setTransactionFilter}
            displayedTransactions={displayedTransactions}
            filteredTransactions={filteredTransactions}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            balance={balance}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            onAddNew={onAddNew}
            CATEGORY_LABELS={CATEGORY_LABELS}
            TRANSACTION_FILTERS={TRANSACTION_FILTERS}
          />
        ) : (
          <LedgerView
            loading={unlabelledLoading}
            transactions={ledgerTransactionsSource}
            ledgerFilter={ledgerFilter}
            setLedgerFilter={setLedgerFilter}
            savingId={savingId}
            handleRelabel={handleRelabel}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            CATEGORY_LABELS={CATEGORY_LABELS}
            CATEGORY_ICON_MAP={CATEGORY_ICON_MAP}
            CATEGORY_COLORS={CATEGORY_COLORS}
            LEDGER_FILTERS={LEDGER_FILTERS}
            ALL_CATEGORIES={ALL_CATEGORIES}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
