import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useToast, TOAST_CONFIGS } from '../../context/ToastContext'

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = TOAST_CONFIGS[toast.type] || TOAST_CONFIGS.info
          const Icon = ICONS[toast.type] || Info

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="pointer-events-auto"
            >
              <div
                className="flex items-start gap-3 p-4 rounded-xl backdrop-blur-md shadow-lg"
                style={{
                  background: config.bgColor,
                  border: `1px solid ${config.borderColor}`,
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Icon */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: config.iconBg }}
                >
                  <Icon size={18} style={{ color: config.iconColor }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium leading-relaxed"
                    style={{ color: 'white' }}
                  >
                    {toast.message}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:bg-white/10"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}