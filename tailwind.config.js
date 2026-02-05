/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fdf2f2',
          100: '#fce7e7',
          200: '#f9d5d5',
          300: '#f4b5b5',
          400: '#ec8888',
          500: '#e15d5d',
          600: '#cd3f3f',
          700: '#ab2d2d',
          800: '#8f2929',
          900: '#7a2828',
          950: '#421212',
        },
        wine: {
          50: '#fdf2f4',
          100: '#fce7ea',
          200: '#f9d0d9',
          300: '#f4aab8',
          400: '#ec7a93',
          500: '#e04d70',
          600: '#cd2d54',
          700: '#ab1f43',
          800: '#8f1d3d',
          900: '#7a1d37',
          950: '#420a1a',
        }
      }
    },
  },
  plugins: [],
};
