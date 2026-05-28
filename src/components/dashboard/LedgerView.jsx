import { motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'

export default function LedgerView({
  loading,
  transactions,
  ledgerFilter,
  setLedgerFilter,
  savingId,
  handleRelabel,
  formatCurrency,
  formatDate,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  LEDGER_FILTERS,
  ALL_CATEGORIES,
}) {
  return (
    <motion.div
      key="ledger-view"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <div className="flex gap-2 p-3 overflow-x-auto">
        {LEDGER_FILTERS.map(({ key, label }) => {
          const active = ledgerFilter === key

          const color = key === 'all' ? '#00f5ff' : CATEGORY_COLORS[key]

          return (
            <button
              key={key}
              onClick={() => setLedgerFilter(key)}
              className="px-3 py-1.5 rounded-lg text-xs"
              style={
                active
                  ? {
                      background: `${color}22`,
                      color,
                    }
                  : {
                      background: 'rgba(0,245,255,0.05)',
                      color: '#94a3b8',
                    }
              }
            >
              {label}
            </button>
          )
        })}
      </div>
      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="animate-spin mx-auto" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <Check size={36} className="mx-auto mb-3 text-green-400" />

            <p className="text-white font-semibold">
              Semua transaksi sudah terlabel
            </p>
          </div>
        ) : (
          transactions.map((tx) => (
            <motion.div
              key={tx.id}
              className="rounded-xl p-4"
              style={{
                background: 'rgba(0, 245, 255, 0.03)',
                border: '1px solid rgba(0, 245, 255, 0.08)',
              }}
            >
              <div className="flex justify-between mb-3">
                <div>
                  <p className="text-white font-medium text-sm">
                    {tx.description}
                  </p>

                  <p className="text-xs text-gray-400">
                    {formatDate(tx.dateTime)}
                  </p>
                </div>

                <p
                  className="font-semibold text-sm"
                  style={{
                    color:
                      tx.transactionType === 'credit' ? '#4ade80' : '#f87171',
                  }}
                >
                  {tx.transactionType === 'credit' ? '+' : '-'}
                  Rp {formatCurrency(tx.amount)}
                </p>
              </div>

              <div className="flex gap-2">
                <select
                  defaultValue={tx.categoryLabel || 'lainnya'}
                  id={`cat-select-${tx.id}`}
                  className="flex-1 px-4 py-2 rounded-xl outline-none"
                  style={{
                    background: 'rgb(2, 17, 31)',
                    border: '1px solid rgba(0, 245, 255, 0.15)',
                    color: 'white',
                  }}
                >
                  {ALL_CATEGORIES.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      style={{
                        background: 'rgb(2, 17, 31)',
                        color: 'white',
                      }}
                    >
                      {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>

                <button
                  disabled={savingId === tx.id}
                  onClick={() => {
                    const select = document.getElementById(
                      `cat-select-${tx.id}`,
                    )

                    if (select) {
                      handleRelabel(tx.id, select.value)
                    }
                  }}
                  className="px-5 py-2 rounded-xl font-bold"
                  style={{
                    background: 'rgba(0, 245, 255, 0.12)',
                    border: '1px solid rgba(0, 245, 255, 0.2)',
                    color: 'rgb(0, 245, 255)',
                  }}
                >
                  {savingId === tx.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
