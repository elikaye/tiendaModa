/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        marck: ['Marck Script', 'cursive'],
      },
    
      extend: {
  animation: {
    shimmer: 'shimmer 3s linear infinite',
  },
  keyframes: {
    shimmer: {
      '0%': { backgroundPosition: '200% center' },
      '100%': { backgroundPosition: '-200% center' },
    },
  },
  backgroundImage: {
    'shimmer-gradient': 'linear-gradient(90deg, #666, #fff, #666)', // gris plata brillante
  },
},
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
    },
  },
  plugins: [],
}
