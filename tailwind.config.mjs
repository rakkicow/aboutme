/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#FAFAFA',
        ink: {
          DEFAULT: '#0F0F10',
          soft: '#1F2024',
          muted: '#6B6B70',
          faint: '#A8A8AE',
        },
        ember: {
          50: '#FFF4EE',
          100: '#FFE3D2',
          200: '#FFC8A4',
          300: '#FFA771',
          400: '#FF9043',
          500: '#FF7A1E',
          600: '#FF6A05',
          700: '#E45200',
          800: '#B44000',
        },
        peach: '#FFD4B8',
        // Cow pink — Ria's signature accent
        cow: {
          50: '#FBF1F4',
          100: '#F6E0E9',
          200: '#ECC3D3',
          300: '#DC9BB5',
          400: '#CC7A9B',
          500: '#B85B82',
          600: '#9A4267',
        },
        // iMessage blue
        imsg: {
          400: '#3B8BFF',
          500: '#1E7AFF',
          600: '#0066FF',
          700: '#0052D9',
        },
        // Terminal slate + classic terminal green palette
        term: {
          bg: '#1F2A3A',
          bgSoft: '#2A3648',
          line: '#3A475C',
          ink: '#E8ECF4',
          dim: '#8A99B5',
          green: '#39FF14',      // classic neon terminal green for typed commands
          greenSoft: '#7CE57C',  // softer green for output lines
          greenDim: '#5DBA5D',   // dimmer green for less-important output
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Fraunces Variable"', 'Fraunces', 'ui-serif', 'Georgia', 'serif'],
        cursive: ['Allura', 'cursive'],
      },
      letterSpacing: {
        tightest: '-0.05em',
        snug: '-0.02em',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      animation: {
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'mesh-drift': 'meshDrift 22s ease-in-out infinite',
        'mesh-drift-2': 'meshDrift2 28s ease-in-out infinite',
        'mesh-drift-3': 'meshDrift3 34s ease-in-out infinite',
        'marquee': 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        'breathe': 'breathe 6s ease-in-out infinite',
        'spin-slow': 'spin 18s linear infinite',
        'rec-blink': 'recBlink 1.4s ease-in-out infinite',
        'blob-morph': 'blobMorph 14s ease-in-out infinite',
        'caret': 'caret 1s steps(1) infinite',
        'shimmer': 'shimmer 3.2s linear infinite',
        'float': 'float 7s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        meshDrift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(8%,-6%,0) scale(1.15)' },
          '66%': { transform: 'translate3d(-6%,4%,0) scale(0.95)' },
        },
        meshDrift2: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1.05)' },
          '50%': { transform: 'translate3d(-10%,8%,0) scale(0.9)' },
        },
        meshDrift3: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(0.95)' },
          '40%': { transform: 'translate3d(12%,10%,0) scale(1.2)' },
          '80%': { transform: 'translate3d(-4%,-8%,0) scale(1.05)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.02)', filter: 'brightness(1.06)' },
        },
        recBlink: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 24px 4px rgba(255,40,40,0.65)' },
          '50%': { opacity: '0.35', boxShadow: '0 0 8px 1px rgba(255,40,40,0.35)' },
        },
        blobMorph: {
          '0%, 100%': { borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%' },
          '25%': { borderRadius: '40% 60% 70% 30% / 55% 35% 65% 45%' },
          '50%': { borderRadius: '50% 50% 33% 67% / 38% 60% 40% 62%' },
          '75%': { borderRadius: '70% 30% 45% 55% / 62% 50% 50% 38%' },
        },
        caret: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
};
