import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../data/timeline";
import Logo from "./common/logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLaunchApp = () => {
    const token = localStorage.getItem('fintime_token');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10"
        style={{
          height: "70px",
          background: scrolled ? "rgba(2,11,24,0.92)" : "rgba(2,11,24,0.4)",
          backdropFilter: scrolled ? "blur(24px)" : "blur(8px)",
          borderBottom: scrolled
            ? "1px solid rgba(0,245,255,0.08)"
            : "1px solid transparent",
          transition: "all 0.4s ease",
        }}
      >
        <Logo />

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => scrollTo(link.href)}
                className="nav-link-hover text-sm font-semibold tracking-widest uppercase"
                style={{
                  color: "var(--text-muted)",
                  background: "none",
                  border: "none",
                  padding: "4px 0",
                  letterSpacing: "0.08em",
                  fontFamily: "Sora, sans-serif",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#00f5ff")}
                onMouseLeave={(e) =>
                  (e.target.style.color = "var(--text-muted)")
                }
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLaunchApp}
            className="hidden md:flex items-center gap-2 btn-ghost text-sm font-bold px-4 py-2"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            <span>Login</span>
            <span style={{ color: "var(--cyan)" }}>→</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary text-sm font-bold px-5 py-2.5"
            onClick={handleLaunchApp}
          >
            Launch App
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: "none", border: "none" }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{
                  rotate:
                    mobileOpen && i === 0
                      ? 45
                      : mobileOpen && i === 2
                        ? -45
                        : 0,
                  y: mobileOpen && i === 0 ? 8 : mobileOpen && i === 2 ? -8 : 0,
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                }}
                style={{
                  display: "block",
                  width: 24,
                  height: 1.5,
                  background: "#00f5ff",
                  borderRadius: 1,
                }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ opacity: mobileOpen ? 1 : 0, y: mobileOpen ? 0 : -20 }}
        style={{
          pointerEvents: mobileOpen ? "all" : "none",
          position: "fixed",
          top: 70,
          left: 0,
          right: 0,
          zIndex: 49,
          background: "rgba(2,11,24,0.98)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(0,245,255,0.08)",
          padding: "1.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {NAV_LINKS.map((link) => (
          <button
            key={link.href}
            onClick={() => scrollTo(link.href)}
            className="text-left text-base font-semibold"
            style={{
              color: "var(--text-muted)",
              background: "none",
              border: "none",
              fontFamily: "Sora, sans-serif",
            }}
          >
            {link.label}
          </button>
        ))}
        <button
          onClick={handleLaunchApp}
          className="btn-ghost text-sm font-bold py-2.5 mt-2"
        >
          Login
        </button>
      </motion.div>
    </>
  );
}
