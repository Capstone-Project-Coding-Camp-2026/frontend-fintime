import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ParticleField from './components/Particlefield'
import HeroSection from './components/HeroSection'
import TimelineSection from './components/TimelineSection'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <main className="relative min-h-screen overflow-hidden bg-[#020b18]">
            <ParticleField />
            <Navbar />
            <HeroSection />
            <TimelineSection />
          </main>
        }
      />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}