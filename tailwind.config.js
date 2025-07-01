/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ['Montserrat', 'sans-serif'],
        body: ['Playfair Display', 'serif'],
      },

      animation: {
        shimmer: 'shimmer 3s linear infinite',
        gradient: 'gradient 15s ease infinite',
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },

      backgroundImage: {
        'shimmer-gradient': 'linear-gradient(90deg, #ccc, #fff, #ccc)', // plateado más claro
      },
    },
  },
  plugins: [],
}
