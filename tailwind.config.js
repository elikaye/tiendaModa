// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ['Cormorat Garamond', 'Abril Fatface'],
        body: ['Playfair Display', 'serif'],
      },
      animation: {
        shimmer: 'shimmer 6s linear infinite',
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
         'shimmer-gradient': 'linear-gradient(90deg, #ffffff, #ec4899, #e5e5e5)', // más claro y metalizado

      },
    },
  },
  plugins: [],
}
