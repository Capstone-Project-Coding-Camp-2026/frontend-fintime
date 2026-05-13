import { motion } from 'framer-motion'

// Import assets
import maleGood from '../../assets/avatars/male_good.png'
import maleNormal from '../../assets/avatars/male_normal.png'
import maleBad from '../../assets/avatars/male_bad.png'
import femaleGood from '../../assets/avatars/female_good.png'
import femaleNormal from '../../assets/avatars/female_normal.png'
import femaleBad from '../../assets/avatars/female_bad.png'

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
}

const avatarImages = {
  male: {
    good: maleGood,
    normal: maleNormal,
    bad: maleBad,
  },
  female: {
    good: femaleGood,
    normal: femaleNormal,
    bad: femaleBad,
  },
}

const avatarColors = {
  good: {
    border: 'rgba(34, 197, 94, 0.5)',
    glow: '0 0 30px rgba(34, 197, 94, 0.4)',
  },
  normal: {
    border: 'rgba(251, 191, 36, 0.5)',
    glow: '0 0 30px rgba(251, 191, 36, 0.4)',
  },
  bad: {
    border: 'rgba(239, 68, 68, 0.5)',
    glow: '0 0 30px rgba(239, 68, 68, 0.4)',
  },
}

export default function ImageAvatar(
  { gender = 'male', condition = 'normal', size = 'md', animated = true, className = '' } 
) {
  // Normalize gender value (female/woman -> female, male/man -> male)
  const normalizedGender = gender?.toLowerCase().includes('female') || gender?.toLowerCase().includes('wanita') || gender?.toLowerCase().includes('perempuan') 
    ? 'female' 
    : 'male'

  const colors = avatarColors[condition] || avatarColors.normal
  const imageSrc = avatarImages[normalizedGender]?.[condition] || avatarImages.male.normal

  const avatarElement = (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center relative ${className} overflow-hidden`}
      style={{
        border: `2px solid ${colors.border}`,
        boxShadow: colors.glow,
        backgroundColor: 'rgba(6, 21, 40, 0.4)'
      }}
    >
      {/* Animated ring border */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: `2px solid ${colors.border}`, opacity: 0.5 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Actual 3D Avatar Image */}
      <img 
        src={imageSrc} 
        alt={`Avatar ${normalizedGender} ${condition}`}
        className="w-full h-full object-cover relative z-10"
      />
    </div>
  )

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-fit mx-auto"
      >
        {avatarElement}
      </motion.div>
    )
  }

  return avatarElement
}
