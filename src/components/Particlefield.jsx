import { useEffect, useRef } from 'react'

export default function ParticleField({ count = 60 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles = []
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div')
      const size = Math.random() * 2 + 1
      const x = Math.random() * 100
      const dur = 10 + Math.random() * 20
      const delay = Math.random() * -30
      const dx = (Math.random() - 0.5) * 300
      const opacity = Math.random() * 0.6 + 0.2

      el.style.cssText = `
        position: absolute;
        left: ${x}%;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: #00f5ff;
        opacity: ${opacity};
        animation: particleFloat ${dur}s ${delay}s linear infinite;
        --dx: ${dx}px;
        box-shadow: 0 0 ${size * 2}px rgba(0,245,255,0.8);
      `
      container.appendChild(el)
      particles.push(el)
    }

    return () => particles.forEach(p => p.remove())
  }, [count])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    />
  )
}