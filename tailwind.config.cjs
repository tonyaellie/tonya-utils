/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        virgil: ['virgil', 'sans-serif'],
      },
      colors: {
        amethyst: {
          1: '#130D1C',
          2: '#0B0112',
        },
        primary: {
          50: '#fef1f9',
          100: '#fee5f5',
          200: '#ffcbed',
          300: '#ffa1db',
          400: '#ff76c7',
          500: '#fa3aa6',
          600: '#ea1883',
          700: '#cc0a68',
          800: '#a80c56',
          900: '#8c0f4a',
          950: '#560129',
        },
      },
    },
  },
  plugins: [],
};
