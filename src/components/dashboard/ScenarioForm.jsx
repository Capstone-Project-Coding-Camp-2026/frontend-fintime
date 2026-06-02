import { motion } from 'framer-motion'
import { Calculator, DollarSign, CreditCard } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const inputBaseStyle = {
  width: '100%',
  background: 'rgba(0, 245, 255, 0.04)',
  border: '1px solid rgba(0, 245, 255, 0.12)',
  borderRadius: '0.75rem',
  color: 'var(--text)',
  fontSize: '0.875rem',
  fontFamily: 'Sora, sans-serif',
  outline: 'none',
  transition: 'border-color 0.3s, background-color 0.3s',
}

export default function ScenarioForm({
  price, setPrice,
  selectedOption, setSelectedOption,
  installmentMonths, setInstallmentMonths,
  interestRate, setInterestRate,
  onAnalyze, isAnalyzing
}) {
  const { t } = useLanguage()
  const isDisabled = isAnalyzing || !price || !selectedOption

  const formatInputCurrency = (value) => {
    const num = value.replace(/\D/g, '')
    return num ? parseInt(num).toLocaleString('id-ID') : ''
  }

  return (
    <div
      className="glass-card rounded-2xl p-6 border"
      style={{ borderColor: 'var(--glass-border)' }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--cyan-glow)' }}
        >
          <Calculator size={18} style={{ color: 'var(--cyan)' }} />
        </div>
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{t('dash_scenario_input')}</h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('dash_scenario_input_desc')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Harga Barang */}
        <div>
          <label className="text-xs mb-2 block uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {t('dash_scenario_price')}
          </label>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
              style={{ color: 'var(--text-dim)' }}
            >
              Rp
            </span>
            <input
              type="text"
              value={formatInputCurrency(price)}
              onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
              placeholder="15.000.000"
              style={{ ...inputBaseStyle, paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--cyan)'
                e.target.style.background = 'rgba(0, 245, 255, 0.08)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(0, 245, 255, 0.12)'
                e.target.style.background = 'rgba(0, 245, 255, 0.04)'
              }}
            />
          </div>
        </div>

        {/* Metode Pembayaran */}
        <div>
          <label className="text-xs mb-2 block uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {t('dash_scenario_method')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedOption('cash')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all"
              style={
                selectedOption === 'cash'
                  ? { backgroundColor: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.3)' }
                  : { backgroundColor: 'rgba(0, 245, 255, 0.04)', color: 'var(--text-muted)', borderColor: 'rgba(0, 245, 255, 0.12)' }
              }
            >
              <DollarSign size={16} />
              {t('dash_scenario_cash')}
            </button>
            <button
              type="button"
              onClick={() => setSelectedOption('paylater')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all"
              style={
                selectedOption === 'paylater'
                  ? { backgroundColor: 'var(--cyan-glow)', color: 'var(--cyan)', borderColor: 'var(--cyan)' }
                  : { backgroundColor: 'rgba(0, 245, 255, 0.04)', color: 'var(--text-muted)', borderColor: 'rgba(0, 245, 255, 0.12)' }
              }
            >
              <CreditCard size={16} />
              {t('dash_scenario_paylater')}
            </button>
          </div>
        </div>

        {/* Tenor & Bunga (PayLater only) */}
        {selectedOption === 'paylater' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 p-4 rounded-xl border"
            style={{ background: 'rgba(0, 245, 255, 0.02)', borderColor: 'rgba(0, 245, 255, 0.08)' }}
          >
            <div>
              <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>
                {t('dash_scenario_tenor')}
              </label>
              <input
                type="number"
                value={installmentMonths}
                onChange={(e) => setInstallmentMonths(e.target.value)}
                placeholder="12"
                min="1"
                max="60"
                style={{ ...inputBaseStyle, padding: '0.75rem 1rem' }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--cyan)'
                  e.target.style.background = 'rgba(0, 245, 255, 0.08)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 245, 255, 0.12)'
                  e.target.style.background = 'rgba(0, 245, 255, 0.04)'
                }}
              />
            </div>
            <div>
              <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>
                {t('dash_scenario_interest')}
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="2"
                min="0"
                max="36"
                style={{ ...inputBaseStyle, padding: '0.75rem 1rem' }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--cyan)'
                  e.target.style.background = 'rgba(0, 245, 255, 0.08)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 245, 255, 0.12)'
                  e.target.style.background = 'rgba(0, 245, 255, 0.04)'
                }}
              />
            </div>
          </motion.div>
        )}


        {/* Tombol Analisis */}
        <button
          onClick={onAnalyze}
          disabled={isDisabled}
          className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 btn-primary"
          style={isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          {isAnalyzing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Calculator size={16} />
              </motion.div>
              {t('dash_scenario_analyzing')}
            </>
          ) : (
            <>
              <Calculator size={16} />
              {t('dash_scenario_btn')}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
