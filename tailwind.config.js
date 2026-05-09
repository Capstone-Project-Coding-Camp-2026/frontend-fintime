/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        display: ['"Clash Display"', 'Sora', 'sans-serif'],
      },
      colors: {
        cyan: {
          DEFAULT: '#00f5ff',
          dim: '#00b4d8',
          muted: '#0096c7',
        },
        dark: {
          DEFAULT: '#020b18',
          2: '#061528',
          3: '#0a1f35',
          4: '#0d2a47',
        },
        text: {
          DEFAULT: '#e0f7ff',
          muted: '#7bafc4',
          dim: '#4a7fa0',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'scan': 'scan 3s ease-in-out infinite',
        'particle': 'particle linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,245,255,0.3)' },
          '50%': { boxShadow: '0 0 60px rgba(0,245,255,0.8), 0 0 100px rgba(0,245,255,0.3)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}