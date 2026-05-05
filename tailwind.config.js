/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#030303',
        brand: {
          dark: '#0A54A8',
          light: '#0CABE3',
        }
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        display: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
