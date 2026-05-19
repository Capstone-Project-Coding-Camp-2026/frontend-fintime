import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, User as UserIcon, Settings, LogOut } from 'lucide-react'

export default function BottomNav({ activePage = 'dashboard', onLogout }) {
  const navigate = useNavigate()

  const navItems = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      label: 'Dash',
      onClick: () => navigate('/dashboard'),
    },
    {
      id: 'profile',
      icon: UserIcon,
      label: 'Profil',
      onClick: () => navigate('/profile'),
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Set',
      onClick: () => {},
    },
    {
      id: 'logout',
      icon: LogOut,
      label: 'Keluar',
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
