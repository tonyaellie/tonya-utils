// const { fontFamily } = await import('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // fontFamily: {
      //   virgil: ['var(--font-virgil)', ...fontFamily.sans],
      // },
    },
  },
  plugins: [],
};
