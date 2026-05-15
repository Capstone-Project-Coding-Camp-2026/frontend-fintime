
import Navbar from '../components/Navbar'
import ParticleField from '../components/Particlefield'
import HeroSection from '../components/HeroSection'
import TimelineSection from '../components/TimelineSection'

export default function LandingPage() {
  return (
    <main className="relative min-h-screen min-h-[100dvh] overflow-hidden bg-[#020b18]">
      <ParticleField />
      <Navbar />
      <HeroSection />
      <TimelineSection />
    </main>
  )
}