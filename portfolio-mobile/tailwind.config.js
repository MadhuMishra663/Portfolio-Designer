/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#0B79FF'
        }
      },
      spacing: {
        '18': '72px'
      },
      borderRadius: {
        'xl2': '18px'
      }
    }
  },
  plugins: [],
};
