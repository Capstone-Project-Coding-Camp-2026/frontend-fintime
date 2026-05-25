
import Navbar from '../components/Navbar'
import ParticleField from '../components/Particlefield'
import HeroSection from '../components/HeroSection'
import TimelineSection from '../components/TimelineSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import CTASection from '../components/landing/CTASection'
import FooterSection from '../components/landing/FooterSection'

export default function LandingPage() {
  return (
    <main className="relative min-h-screen min-h-[100dvh] overflow-hidden bg-[#020b18]">
      <ParticleField />
      <Navbar />
      <HeroSection />
      <TimelineSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <FooterSection />
    </main>
  )
}