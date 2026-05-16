import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TRANSACTION_CATEGORIES } from './dashboardConstants'
import {
  getUnlabelledTransactions,
  relabelTransaction,
} from '../../lib/transactionApi'

const CATEGORIES = TRANSACTION_CATEGORIES

export default function SmartLedger() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)

  const fetchTransactions = async () => {
    try {
      setLoading(true)

      const user = JSON.parse(localStorage.getItem('user'))

      const response = await getUnlabelledTransactions(user.id)

      setTransactions(response.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleRelabel = async (transactionId, categoryLabel) => {
    try {
      setSavingId(transactionId)

      await relabelTransaction(transactionId, categoryLabel)

      setTransactions((prev) => prev.filter((t) => t.id !== transactionId))
    } catch (error) {
      console.error('Failed to relabel:', error)
    } finally {
      setSavingId(null)
    }
  }

  if (loading) {
    return (
      <div
        className="rounded-3xl p-6"
        style={{
          background: 'rgba(6,21,40,0.7)',
          border: '1px solid rgba(0,245,255,0.1)',
        }}
      >
        <p style={{ color: 'white' }}>Loading Smart Ledger...</p>
      </div>
    )
  }

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: 'rgba(6,21,40,0.7)',
        border: '1px solid rgba(0,245,255,0.1)',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-5 flex items-center justify-between"
        style={{
          borderBottom: '1px solid rgba(0,245,255,0.08)',
        }}
      >
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'white' }}>
            Smart Ledger
          </h2>

          <p className="text-sm" style={{ color: '#7aa6c2' }}>
            AI transaction relabelling
          </p>
        </div>

        <div
          className="px-3 py-1 rounded-full text-sm font-bold"
          style={{
            background: 'rgba(255,82,82,0.08)',
            border: '1px solid rgba(255,82,82,0.2)',
            color: '#ff5252',
          }}
        >
          {transactions.length} Pending
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-4">
        {transactions.length === 0 ? (
          <div className="text-center py-10">
            <p className="font-bold" style={{ color: 'white' }}>
              All transactions labelled 🎉
            </p>

            <p className="text-sm mt-2" style={{ color: '#7aa6c2' }}>
              No pending transactions.
            </p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(0,245,255,0.03)',
                border: '1px solid rgba(0,245,255,0.08)',
              }}
            >
              {/* Top */}
              <div className="flex justify-between gap-4">
                <div>
                  <h3
                    className="font-bold text-base"
                    style={{ color: 'white' }}
                  >
                    {transaction.description}
                  </h3>

                  <p className="text-sm mt-1" style={{ color: '#00f5ff' }}>
                    AI Suggestion: {transaction.categoryLabel || 'lainnya'}
                  </p>
                </div>

                <div className="font-bold" style={{ color: 'white' }}>
                  -Rp {transaction.amount.toLocaleString('id-ID')}
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 flex gap-3">
                <select
                  defaultValue={transaction.categoryLabel || 'lainnya'}
                  id={`category-${transaction.id}`}
                  className="flex-1 px-4 py-2 rounded-xl outline-none"
                  style={{
                    background: '#02111f',
                    border: '1px solid rgba(0,245,255,0.15)',
                    color: 'white',
                  }}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <button
                  disabled={savingId === transaction.id}
                  onClick={() => {
                    const select = document.getElementById(
                      `category-${transaction.id}`,
                    )

                    handleRelabel(transaction.id, select.value)
                  }}
                  className="px-5 py-2 rounded-xl font-bold"
                  style={{
                    background: 'rgba(0,245,255,0.12)',
                    border: '1px solid rgba(0,245,255,0.2)',
                    color: '#00f5ff',
                  }}
                >
                  {savingId === transaction.id ? 'Saving...' : 'Save'}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
