/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: {
  	50: '#fef2f4',	
 	 100: '#fde6e9',
	  200: '#fbd0d7',
  	300: '#f7a8b8',
  	400: '#f17694',
  	500: '#e6436e',
  	600: '#8f1133',  // Main brand color
  	700: '#7a0e2b',
  	800: '#650c24',
  	900: '#560a20',
  	950: '#2f0511',
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
