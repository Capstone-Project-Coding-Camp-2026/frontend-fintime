import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ParticleField from "./Particlefield";
import { TIMELINE_DATA } from "../data/timeline";
import { formatRupiah } from "../utils/format";

const HERO_YEARS = TIMELINE_DATA.map((d) => d.year);

function AvatarOrbit({ avatar, color }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 200, height: 200 }}
    >
      {/* Outer orbit ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full"
        style={{ border: "1px solid rgba(0,245,255,0.12)" }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 10,
            height: 10,
            background: color,
            boxShadow: `0 0 15px ${color}`,
            top: -5,
            left: "50%",
            marginLeft: -5,
          }}
        />
      </motion.div>

      {/* Middle orbit ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute rounded-full"
        style={{ inset: 20, border: "1px solid rgba(0,245,255,0.08)" }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 6,
            height: 6,
            background: "rgba(0,245,255,0.5)",
            top: -3,
            left: "50%",
            marginLeft: -3,
          }}
        />
      </motion.div>
      
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 rounded-full flex items-center justify-center"
        style={{
          width: 110,
          height: 110,
          background: `radial-gradient(circle at 35% 35%, ${color}33, rgba(2,11,24,0.9))`,
          border: `2px solid ${color}`,
          boxShadow: `0 0 40px ${color}40, inset 0 0 30px ${color}15`,
          fontSize: "3.5rem",
        }}
      >
        <motion.span
          key={avatar}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          {avatar}
        </motion.span>
      </motion.div>

      {/* Glow ring */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`,
          animation: "breathe 4s ease-in-out infinite",
        }}
      />
    </div>
  );
}

function FloatingTimeline({ activeIdx, onSelect }) {
  return (
    <div className="relative flex items-center justify-center gap-0 mt-8">
      {/* connecting line */}
      <div
        className="absolute"
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 5%, rgba(0,245,255,0.3) 50%, transparent 95%)",
          left: "10%",
          right: "10%",
          top: "20px",
        }}
      />

      {HERO_YEARS.map((year, idx) => (
        <motion.button
          key={year}
          onClick={() => onSelect(idx)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-2 px-4 md:px-6 relative z-10"
          style={{ background: "none", border: "none" }}
        >
          <motion.div
            animate={{
              scale: activeIdx === idx ? 1.3 : 1,
              boxShadow:
                activeIdx === idx
                  ? "0 0 0 4px rgba(0,245,255,0.2), 0 0 25px rgba(0,245,255,0.6)"
                  : "0 0 0 0px transparent",
            }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: "2px solid rgba(0,245,255,0.5)",
              background: activeIdx === idx ? "#00f5ff" : "var(--dark)",
            }}
          />
          <span
            className="font-mono text-xs font-bold tracking-wider"
            style={{
              color: activeIdx === idx ? "#00f5ff" : "var(--text-muted)",
              transition: "color 0.3s",
            }}
          >
            {year}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

export default function HeroSection() {
  const navigate = useNavigate()
  const [activeIdx, setActiveIdx] = useState(0);
  const [displayBalance, setDisplayBalance] = useState(
    TIMELINE_DATA[0].netWorth,
  );
  const heroRef = useRef(null);
  // const navigate = useNavigate()

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const yContent = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const active = TIMELINE_DATA[activeIdx];

  // Animate balance counter
  useEffect(() => {
    const target = active.netWorth;
    const start = displayBalance;
    const diff = target - start;
    const steps = 40;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayBalance(Math.round(start + diff * eased));
      if (step >= steps) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [active.netWorth, activeIdx, displayBalance]);

  // Auto cycle years
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((i) => (i + 1) % TIMELINE_DATA.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollToNext = () => {
    document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{ paddingTop: "80px" }}
    >
      {/* Layered Backgrounds */}
      <div className="absolute inset-0 grid-bg" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(0,150,199,0.1) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 40% at 80% 80%, rgba(0,50,80,0.3) 0%, transparent 60%)",
        }}
      />

      {/* Scanline */}
      <div className="absolute inset-0 scanline pointer-events-none overflow-hidden" />

      {/* Particles */}
      <ParticleField count={70} />

      {/* Horizontal lines */}
      {[20, 40, 60, 80].map((pct) => (
        <div
          key={pct}
          className="absolute w-full pointer-events-none"
          style={{
            top: `${pct}%`,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(0,245,255,0.04), transparent)",
          }}
        />
      ))}

      {/* Main content */}
      <motion.div
        style={{ y: yContent, opacity }}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12 flex flex-col items-center text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
          style={{
            background: "rgba(0,245,255,0.07)",
            border: "1px solid rgba(0,245,255,0.2)",
          }}
        >
          <motion.div
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full"
            style={{ background: "#00f5ff", boxShadow: "0 0 6px #00f5ff" }}
          />
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "var(--cyan)", fontFamily: "Sora, sans-serif" }}
          >
            Dicoding x DBS · AI Financial Simulator
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="font-sora font-extrabold leading-none tracking-tighter"
          style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)" }}
        >
          <span style={{ color: "var(--text)" }}>Your Money.</span>
          <br />
          <span
            style={{
              background:
                "linear-gradient(135deg, #00f5ff 0%, #0096c7 50%, #00f5ff 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 3s linear infinite",
            }}
          >
            Your Future.
          </span>
          <br />
          <span style={{ color: "rgba(224,247,255,0.5)" }}>Simulated.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-6 text-lg md:text-xl leading-relaxed max-w-2xl"
          style={{ color: "var(--text-muted)", fontWeight: 300 }}
        >
          FinTime bukan cuma tracker keuangan — tapi AI yang bantu kamu{" "}
          <span className="font-semibold" style={{ color: "var(--text)" }}>
            lihat arah masa depan finansialmu
          </span>
          . Setiap keputusan hari ini bisa berdampak besar buat tahun-tahun ke
          depan.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary flex items-center gap-2.5 px-8 py-4 text-base font-extrabold rounded-full"
            onClick={() => navigate('/register')}
          >
            <span>🚀</span>
            <span>Start Your Time Machine</span>
          </motion.button>
        </motion.div>

        {/* Avatar + Timeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-12 flex flex-col items-center gap-0"
        >
          {/* Year indicator */}
          <motion.div
            key={active.year}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-sm tracking-widest mb-2"
            style={{ color: "var(--text-dim)" }}
          >
            SIMULATING YEAR
          </motion.div>
          <motion.div
            key={`yr-${active.year}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-mono font-bold text-5xl tracking-tight mb-4"
            style={{ color: active.color }}
          >
            {active.year}
          </motion.div>

          {/* Avatar orb */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.year}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            >
              <AvatarOrbit avatar={active.avatar} color={active.color} />
            </motion.div>
          </AnimatePresence>

          {/* Balance display */}
          <motion.div className="mt-4 text-center">
            <div
              className="text-xs font-mono tracking-widest mb-1"
              style={{ color: "var(--text-dim)" }}
            >
              PROJECTED NET WORTH
            </div>
            <motion.div
              key={displayBalance}
              className="font-mono font-bold"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                background: "linear-gradient(135deg, #00f5ff, #0096c7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {formatRupiah(displayBalance)}
            </motion.div>
            <div
              className="text-xs mt-1"
              style={{ color: "rgba(0,245,255,0.4)" }}
            >
              {active.avatarMood} · {active.aiMoodIcon}
            </div>
          </motion.div>

          {/* Timeline scrubber */}
          <FloatingTimeline activeIdx={activeIdx} onSelect={setActiveIdx} />
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={scrollToNext}
          className="mt-12 flex flex-col items-center gap-2"
          style={{ background: "none", border: "none" }}
        >
          <span
            className="text-xs tracking-widest"
            style={{ color: "var(--text-dim)" }}
          >
            SCROLL TO EXPLORE
          </span>
          {/* <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
            style={{ border: '1.5px solid rgba(0,245,255,0.2)' }}
          >
            <div
              className="w-1 h-2 rounded-full"
              style={{ background: 'rgba(0,245,255,0.6)' }}
            />
          </motion.div> */}
        </motion.button>
      </motion.div>
    </section>
  );
}
