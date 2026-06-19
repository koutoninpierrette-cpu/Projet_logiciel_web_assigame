/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palette Assigame : vert moderne, neutre, propre
        brand: {
          50: '#effaf3',
          100: '#d8f3e1',
          200: '#b3e6c5',
          300: '#85d3a3',
          400: '#56ba7e',
          500: '#34a05f',
          600: '#258149',
          700: '#1f673c',
          800: '#1c5232',
          900: '#19432a',
        },
      },
      fontFamily: {
        sans: ['Public Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)',
        cardHover: '0 10px 30px -8px rgba(16,24,40,0.12)',
      },
    },
  },
  plugins: [],
};
