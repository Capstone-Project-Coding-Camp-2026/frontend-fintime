import Navbar from './components/Navbar'
import ParticleField from './components/ParticleField'
import HeroSection from './components/HeroSection'
import TimelineSection from './components/TimelineSection'

export default function App() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020b18]">
      <ParticleField />

      <Navbar />

      <HeroSection />

      <TimelineSection />
    </main>
  )
}