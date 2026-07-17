/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFFBF7',
        rose: {
          warm: '#C48181',
          soft: '#D4A38B',
          muted: '#9B7070',
          deep: '#5C4040',
          light: '#FFF5F5',
          blush: '#FFE4E1',
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        chinese: ["'Noto Serif SC'", "serif"],
        body: ["'Inter'", "'Noto Sans SC'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
