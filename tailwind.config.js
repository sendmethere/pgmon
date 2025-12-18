/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'pgm-primary': '#4f46e5',
        'pgm-secondary': '#06b6d4',
        'pgm-accent': '#f59e0b',
        'pgm-neutral': '#6b7280',
        'pgm-base': '#f8fafc',
      },
      fontFamily: {
        'sans': ['Pretendard', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}