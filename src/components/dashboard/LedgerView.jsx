import { motion } from 'framer-motion'
import { Check, Loader2, Filter, ChevronDown } from 'lucide-react'

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
  TRANSACTION_CATEGORIES,
}) {
  return (
    <motion.div
      key="ledger-view"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <div
        className="px-4 py-3 border-b mb-1"
        style={{ borderColor: 'rgba(0, 245, 255, 0.08)' }}
      >
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative"
          style={{
            background: 'rgba(0, 245, 255, 0.04)',
            border: '1px solid rgba(0, 245, 255, 0.1)',
          }}
        >
          <Filter size={16} style={{ color: '#00f5ff' }} />
          <select
            value={ledgerFilter}
            onChange={(e) => setLedgerFilter(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium outline-none appearance-none cursor-pointer w-full z-10"
            style={{
              color:
                ledgerFilter === 'all'
                  ? '#00f5ff'
                  : CATEGORY_COLORS[ledgerFilter] || '#fff',
            }}
          >
            {LEDGER_FILTERS.map(({ key, label }) => (
              <option
                key={key}
                value={key}
                style={{ background: 'rgb(2, 17, 31)', color: 'white' }}
              >
                {key === 'all'
                  ? 'Tampilkan Semua Kategori'
                  : `Kategori: ${label}`}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-4 z-0 pointer-events-none"
            style={{ color: '#94a3b8' }}
          />
        </div>
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
                  {TRANSACTION_CATEGORIES.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      style={{
                        background: 'rgb(2, 17, 31)',
                        color: 'white',
                      }}
                    >
                      {CATEGORY_LABELS[cat] || cat}
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
                  className="px-5 py-2 rounded-xl font-bold transition-all hover:brightness-125 disabled:opacity-50 text-xs"
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
