/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFA',
        surface: '#FFFFFF',
        border: '#E5E7EB',
        primary: {
          DEFAULT: '#4F46E5',
          soft: '#EEF2FF',
          dark: '#4338CA',
        },
        text: {
          main: '#111827',
          muted: '#6B7280',
          light: '#9CA3AF'
        },
        semantic: {
          success: '#10B981',
          successSoft: '#ECFDF5',
          warning: '#F59E0B',
          warningSoft: '#FFFBEB',
          danger: '#EF4444',
          dangerSoft: '#FEF2F2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
