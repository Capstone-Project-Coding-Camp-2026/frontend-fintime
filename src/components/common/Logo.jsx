import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Timer } from 'lucide-react'

// Force Vite HMR reload
const Logo = ({ size = 'md', showText = true, rotateDuration = 10 }) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-12 h-12 text-xl',
  }

  return (
    <Link to="/" className="flex items-center gap-3 no-underline">
      <div
        className={`${sizes[size]} rounded-xl flex items-center justify-center`}
        style={{
          background: 'rgba(0,245,255,0.1)',
          border: '1px solid rgba(0,245,255,0.3)',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: rotateDuration,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex items-center justify-center"
        >
          <Timer size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} color="#00f5ff" />
        </motion.div>
      </div>

        <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-[#00f5ff] to-[#0096c7]">
          FinTime
        </span>
    </Link>
  )
}

export default Logo
