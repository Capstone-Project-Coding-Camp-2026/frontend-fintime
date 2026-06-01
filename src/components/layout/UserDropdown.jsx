import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react'

export default function UserDropdown({ user, onLogout }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.02 }}
        className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all"
        style={{
          background: 'rgba(0,245,255,0.05)',
          border: '1px solid rgba(0,245,255,0.15)',
        }}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold">
          {user.fullName?.charAt(0)}
        </div>
        <div className="text-left hidden lg:block">
          <p className="text-sm font-semibold">{user.fullName}</p>
          <p className="text-[10px] text-gray-500">
            {user.occupation || 'Investor'}
          </p>
        </div>
        <ChevronDown
          size={16}
          style={{ color: 'var(--text-dim)' }}
          className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden"
            style={{
              background: '#061528',
              border: '1px solid rgba(0,245,255,0.15)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
          >
            <div className="p-2">
              <button
                onClick={() => {
                  navigate('/profile')
                  setOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-cyan-400 transition-all"
              >
                <UserIcon size={18} />
                <span className="font-medium">Profil Saya</span>
              </button>
            </div>
            <div className="border-t border-white/5 p-2">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={18} />
                <span className="font-medium">Keluar</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
