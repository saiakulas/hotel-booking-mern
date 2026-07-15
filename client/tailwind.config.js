/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F6E56',
          50:  '#E8F4F0',
          100: '#C5E4DA',
          200: '#8FCABC',
          300: '#5AB0A0',
          400: '#279684',
          500: '#0F6E56',
          600: '#0C5A46',
          700: '#094737',
          800: '#063427',
          900: '#032118',
        },
        accent: {
          DEFAULT: '#D85A30',
          light: '#F0795A',
          dark:  '#B54420',
        },
        highlight: {
          DEFAULT: '#FAC775',
          light: '#FDD9A0',
          dark:  '#E8A94A',
        },
        base: '#F8F9FA',
        charcoal: '#2C2C2A',
        muted: '#5F5E5A',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card':   '0 2px 12px rgba(15,110,86,0.07)',
        'hover':  '0 8px 28px rgba(15,110,86,0.13)',
        'accent': '0 4px 20px rgba(216,90,48,0.25)',
      },
      animation: {
        'fade-in':  'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'float':    'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
