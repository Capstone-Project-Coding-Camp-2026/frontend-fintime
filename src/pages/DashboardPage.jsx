import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LogOut, LayoutDashboard, Settings, User as UserIcon, Bell } from 'lucide-react'

import ParticleField from '../components/Particlefield'
import AvatarConditionBanner from '../components/dashboard/AvatarConditionBanner'
import ScenarioForm from '../components/dashboard/ScenarioForm'
import AnalysisResult from '../components/dashboard/AnalysisResult'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  
  // State untuk Scenario Form
  const [price, setPrice] = useState('')
  const [selectedOption, setSelectedOption] = useState('cash')
  const [installmentMonths, setInstallmentMonths] = useState('12')
  const [interestRate, setInterestRate] = useState('15')
  const [monthlyBudget, setMonthlyBudget] = useState('')
  
  // State untuk Analysis Result
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [analysisData, setAnalysisData] = useState({
    goodPercent: 0,
    neutralPercent: 0,
    badPercent: 0,
    verdict: 'neutral',
    monthlyPayment: 0,
    remainingBudget: 0,
    totalPayment: 0
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('fintime_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      navigate('/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('fintime_token')
    localStorage.removeItem('fintime_user')
    navigate('/login')
  }

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setHasResult(false)

    // Simulasi analisis logic
    setTimeout(() => {
      const p = parseFloat(price) || 0
      const b = parseFloat(monthlyBudget) || 0
      let total = p
      let monthly = p

      if (selectedOption === 'paylater') {
        const months = parseInt(installmentMonths) || 12
        const rate = (parseFloat(interestRate) || 15) / 100
        total = p + (p * rate * (months / 12))
        monthly = total / months
      }

      const remaining = b - monthly
      
      // Kalkulasi probabilitas sederhana untuk demo
      let verdict = 'neutral'
      let good = 40, neutral = 40, bad = 20

      if (remaining > (b * 0.5)) {
        verdict = 'good'
        good = 85; neutral = 10; bad = 5
      } else if (remaining < 0) {
        verdict = 'bad'
        good = 5; neutral = 15; bad = 80
      }

      setAnalysisData({
        goodPercent: good,
        neutralPercent: neutral,
        badPercent: bad,
        verdict: verdict,
        monthlyPayment: Math.round(monthly),
        remainingBudget: Math.round(remaining),
        totalPayment: Math.round(total)
      })

      setIsAnalyzing(false)
      setHasResult(true)
    }, 2000)
  }

  if (!user) return null

  return (
    <div className="relative min-h-screen bg-[#020b18] text-white font-['Sora'] overflow-x-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <ParticleField count={30} />
      </div>

      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 lg:w-64 bg-[#061528]/80 backdrop-blur-xl border-r border-white/5 z-50 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/30">
            ⏱
          </div>
          <span className="text-xl font-extrabold grad-text hidden lg:block">FinTime</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: UserIcon, label: 'Profile', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                item.active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <item.icon size={20} />
              <span className="font-semibold hidden lg:block">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            <span className="font-semibold hidden lg:block">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-20 lg:ml-64 p-4 sm:p-6 lg:p-8 relative z-10 pb-20">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Overview Dashboard</h1>
            <p className="text-gray-400 text-sm">Selamat datang kembali, {user.fullName || 'User'}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative hover:bg-white/10 transition-all">
              <Bell size={18} className="text-gray-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020b18]"></span>
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold">{user.fullName}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user.occupation || 'Investor'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px]">
                <div className="w-full h-full rounded-full bg-[#020b18] flex items-center justify-center text-sm font-bold">
                  {user.fullName?.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Banner Section */}
        <section className="mb-8">
          <AvatarConditionBanner 
            userName={user.fullName} 
            gender={user.gender || 'male'}
            balance={15400000} 
            targetPension={500000000} 
          />
        </section>

        {/* Analysis Section */}
        <section className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
          <ScenarioForm 
            price={price} setPrice={setPrice}
            selectedOption={selectedOption} setSelectedOption={setSelectedOption}
            installmentMonths={installmentMonths} setInstallmentMonths={setInstallmentMonths}
            interestRate={interestRate} setInterestRate={interestRate}
            monthlyBudget={monthlyBudget} setMonthlyBudget={setMonthlyBudget}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />

          <AnalysisResult 
            {...analysisData}
            price={parseFloat(price) || 0}
            selectedOption={selectedOption}
            hasResult={hasResult}
          />
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#061528]/90 backdrop-blur-xl border-t border-white/5 p-3 flex justify-around items-center md:hidden z-50">
        <button className="flex flex-col items-center gap-1 text-cyan-400">
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold">Dash</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-500">
          <UserIcon size={20} />
          <span className="text-[10px]">Profil</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-500">
          <Settings size={20} />
          <span className="text-[10px]">Set</span>
        </button>
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-red-400">
          <LogOut size={20} />
          <span className="text-[10px]">Keluar</span>
        </button>
      </nav>
    </div>
  )
}
