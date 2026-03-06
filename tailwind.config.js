/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#060d1a',
        'bg-card': '#0a0f1e',
      },
      animation: {
        'marquee': 'marquee 50s linear infinite',
        'marquee2': 'marquee2 50s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glow-red': '0 0 0 1px rgba(239, 68, 68, 0.25), 0 0 30px rgba(239, 68, 68, 0.08)',
        'glow-green': '0 0 0 1px rgba(34, 197, 94, 0.25), 0 0 30px rgba(34, 197, 94, 0.08)',
        'glow-blue': '0 0 0 1px rgba(59, 130, 246, 0.25), 0 0 30px rgba(59, 130, 246, 0.08)',
        'glow-orange': '0 0 0 1px rgba(249, 115, 22, 0.25), 0 0 30px rgba(249, 115, 22, 0.08)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}
