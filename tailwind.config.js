/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          bg: '#07090E',
          surface: '#0F131D',
          panel: '#151B28',
          border: '#1F293D',
          borderLight: '#2F3C56',
        },
        gold: {
          light: '#FDE68A',
          DEFAULT: '#F59E0B',
          amber: '#D97706',
          dark: '#B45309',
          glow: 'rgba(245, 158, 11, 0.35)',
        },
        neon: {
          blue: '#38BDF8',
          cyan: '#06B6D4',
          crimson: '#EF4444',
          amber: '#F59E0B',
          purple: '#A855F7',
        }
      },
      fontFamily: {
        cinematic: ['Cinzel', 'Georgia', 'serif'],
        display: ['Cabinet Grotesk', 'Montserrat', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 4s infinite',
        'radar-ping': 'radarPing 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '0.99' },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.6' },
        },
        radarPing: {
          '0%': { transform: 'scale(1)', opacity: '0.9' },
          '80%, 100%': { transform: 'scale(2.4)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}

