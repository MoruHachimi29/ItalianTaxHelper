/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#4a4a4a',
        accent: '#e1e1e1',
        border: '#dcdcdc',
        background: '#ffffff',
        foreground: '#000000',
        error: '#ff3b30',
        success: '#34c759',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
}