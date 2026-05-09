import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { TIMELINE_DATA } from "../data/timeline";
import { formatRupiah } from "../utils/format";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function StatCard({ label, value, valueColor }) {
  return (
    <div
      className="p-4 rounded-2xl"
      style={{
        background: "rgba(0,245,255,0.04)",
        border: "1px solid rgba(0,245,255,0.08)",
      }}
    >
      <div
        className="text-xs font-bold tracking-widest uppercase mb-2"
        style={{ color: "var(--text-dim)" }}
      >
        {label}
      </div>
      <div
        className="text-base font-bold"
        style={{ color: valueColor || "var(--text)" }}
      >
        {value}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs font-mono"
      style={{
        background: "rgba(6,21,40,0.95)",
        border: "1px solid rgba(0,245,255,0.2)",
        color: "#00f5ff",
      }}
    >
      {formatRupiah(payload[0].value, true)}
    </div>
  );
}

export default function TimelineSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const { ref, isVisible } = useScrollReveal();

  const active = TIMELINE_DATA[activeIdx];

  return (
    <section
      id="timeline"
      className="relative py-24 md:py-32"
      style={{ background: "var(--dark-2)" }}
    >
      {/* Decorative top border */}
      <div className="neon-line absolute top-0 left-0 right-0" />

      <div className="container max-w-6xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <div className="section-label">Interactive Timeline</div>
          <h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none mb-4"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Travel Through{" "}
            <span className="grad-text">Your Financial Future</span>
          </h2>
          <p
            className="text-base leading-relaxed max-w-xl"
            style={{ color: "var(--text-muted)" }}
          >
            Pilih tahun untuk lihat proyeksi finansialmu versi AI. Lihat kondisi
            avatarmu berubah seiring hasil keputusan finansialmu di masa depan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Year Selector — left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-2 flex flex-col gap-3"
          >
            {TIMELINE_DATA.map((data, idx) => (
              <motion.button
                key={data.year}
                onClick={() => setActiveIdx(idx)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full text-left rounded-2xl overflow-hidden transition-all duration-400"
                style={{
                  background:
                    activeIdx === idx
                      ? "rgba(0,245,255,0.06)"
                      : "rgba(6,21,40,0.5)",
                  border:
                    activeIdx === idx
                      ? `1px solid ${data.color}60`
                      : "1px solid rgba(0,245,255,0.08)",
                  padding: "1.2rem 1.5rem",
                  boxShadow:
                    activeIdx === idx ? `0 0 30px ${data.color}12` : "none",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {/* Active indicator bar */}
                {activeIdx === idx && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                    style={{
                      background: `linear-gradient(to bottom, ${data.color}, transparent)`,
                    }}
                  />
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span
                      className="font-mono text-2xl font-bold"
                      style={{
                        color:
                          activeIdx === idx ? data.color : "var(--text-muted)",
                      }}
                    >
                      {data.year}
                    </span>
                    <div>
                      <div
                        className="text-sm font-bold mb-0.5"
                        style={{
                          color:
                            activeIdx === idx
                              ? "var(--text)"
                              : "var(--text-muted)",
                        }}
                      >
                        {data.label}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--text-dim)" }}
                      >
                        {data.description.split(".")[0]}.
                      </div>
                    </div>
                  </div>
                  <span className="text-xl">{data.avatar}</span>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {activeIdx === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mt-3 pt-3"
                        style={{ borderTop: "1px solid rgba(0,245,255,0.08)" }}
                      >
                        <div
                          className="font-mono text-sm font-bold"
                          style={{
                            background: `linear-gradient(135deg, ${data.color}, #0096c7)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {formatRupiah(data.netWorth)}
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: "var(--text-dim)" }}
                        >
                          Projected Net Worth
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </motion.div>

          {/* State Panel — right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.year}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl p-6 md:p-8 relative overflow-hidden"
                style={{
                  background: "rgba(6,21,40,0.7)",
                  border: `1px solid ${active.color}30`,
                  backdropFilter: "blur(12px)",
                  boxShadow: `0 0 60px ${active.color}08`,
                }}
              >
                {/* Decorative gradient */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 60% 40% at 100% 0%, ${active.color}08, transparent)`,
                  }}
                />

                {/* Avatar + Year header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div
                      className="text-xs font-mono tracking-widest mb-1"
                      style={{ color: "var(--text-dim)" }}
                    >
                      YOUR AVATAR · {active.year}
                    </div>
                    <div
                      className="text-xl font-extrabold tracking-tight"
                      style={{ color: active.color }}
                    >
                      {active.avatarMood}
                    </div>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-6xl"
                  >
                    {active.avatar}
                  </motion.div>
                </div>

                {/* Balance */}
                <div className="mb-6">
                  <div
                    className="text-xs font-mono tracking-widest mb-1"
                    style={{ color: "var(--text-dim)" }}
                  >
                    PROJECTED NET WORTH
                  </div>
                  <motion.div
                    key={active.netWorth}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="font-mono font-extrabold"
                    style={{
                      fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                      background: `linear-gradient(135deg, ${active.color}, #0096c7)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {formatRupiah(active.netWorth)}
                  </motion.div>
                </div>

                {/* Mini chart */}
                <div
                  className="relative mb-6 w-full min-w-0"
                  style={{
                    height: 100,
                    minHeight: 100,
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={active.chartData}
                      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id={`grad-${active.year}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={active.color}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={active.color}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" hide />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={active.color}
                        strokeWidth={2}
                        fill={`url(#grad-${active.year})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <StatCard
                    label="Monthly Savings"
                    value={formatRupiah(active.savings, true)}
                    valueColor="#00e676"
                  />
                  <StatCard
                    label="Retirement Fund"
                    value={
                      active.retirementFund > 0
                        ? formatRupiah(active.retirementFund, true)
                        : "Not started"
                    }
                    valueColor={
                      active.retirementFund > 0
                        ? active.color
                        : "var(--text-muted)"
                    }
                  />
                  <StatCard
                    label="AI Risk Score"
                    value={`${active.riskIcon} ${active.riskScore}`}
                  />
                  <StatCard
                    label="Fund Longevity"
                    value={active.fundLongevity || "Calculating..."}
                    valueColor={
                      active.fundLongevity ? "#00e676" : "var(--text-muted)"
                    }
                  />
                </div>

                {/* AI Verdict */}
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: `${active.color}08`,
                    border: `1px solid ${active.color}20`,
                  }}
                >
                  <div
                    className="text-xs font-bold tracking-widest mb-2"
                    style={{ color: active.color }}
                  >
                    🤖 AI VERDICT
                  </div>
                  <p
                    className="text-sm leading-relaxed italic"
                    style={{ color: "var(--text-muted)" }}
                  >
                    "{active.aiVerdict}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <div className="neon-line absolute bottom-0 left-0 right-0" />
    </section>
  );
}
