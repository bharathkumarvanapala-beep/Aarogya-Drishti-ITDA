/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          900: '#075B4D', // Primary forest green
          800: '#087653', // Secondary green
          700: '#398F72', // Natural accent green
          600: '#4A9F82',
          200: '#B8E1D5',
          100: '#DCEFEA', // Soft nature accent
          50:  '#E8F5EF', // Light green background
        },
        ink: {
          DEFAULT: '#173B36', // Main text
          muted:   '#64748B', // Secondary text
          light:   '#94A3B8',
        },
        status: {
          info:    '#2865A5', // Information blue
          warning: '#986000', // Warning amber
          success: '#087653', // Success green
          danger:  '#B44838', // Error red
          neutral: '#94A3B8', // Grey / Not Available
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'Noto Sans Telugu', 'system-ui', 'sans-serif'],
        telugu: ['Noto Sans Telugu', 'Tenali Ramakrishna', 'sans-serif'],
      },
      boxShadow: {
        'nature': '0 4px 20px -2px rgba(7, 91, 77, 0.08), 0 2px 6px -1px rgba(7, 91, 77, 0.04)',
        'nature-lg': '0 10px 30px -4px rgba(7, 91, 77, 0.12), 0 4px 12px -2px rgba(7, 91, 77, 0.06)',
        'nature-card': '0 2px 12px rgba(7, 91, 77, 0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
