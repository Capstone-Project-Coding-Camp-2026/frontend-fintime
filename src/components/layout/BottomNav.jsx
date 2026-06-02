import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, User as UserIcon, FileText, LogOut } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function BottomNav({ activePage = 'dashboard', onLogout }) {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const navItems = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      label: t('nav_dash_short'),
      onClick: () => navigate('/dashboard'),
    },
    {
      id: 'reports',
      icon: FileText,
      label: t('nav_reports'),
      onClick: () => navigate('/reports'),
    },
    {
      id: 'profile',
      icon: UserIcon,
      label: t('nav_profile'),
      onClick: () => navigate('/profile'),
    },
    {
      id: 'logout',
      icon: LogOut,
      label: t('nav_logout'),
      onClick: onLogout,
      isDestructive: true,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#061528]/90 backdrop-blur-xl border-t border-white/5 p-3 flex justify-around items-center md:hidden z-50">
      {navItems.map((item) => {
        const isActive = item.id === activePage
        const color = item.isDestructive
          ? 'text-red-400'
          : isActive
            ? 'text-cyan-400'
            : 'text-gray-400'

        return (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`flex flex-col items-center gap-1 ${color}`}
            disabled={isActive && !item.isDestructive}
          >
            <item.icon size={22} />
            <span className={`text-[10px] ${isActive ? 'font-bold' : ''}`}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
