/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Retrô-Moderna Patties Burger
        'brand-red': '#DA291C',
        'brand-yellow': '#FFC72C',
        'brand-cream': '#FAF6EE',
        'brand-dark': '#1E1B18',
        'brand-light': '#FAF6EE',
        'brand-gray': '#6B7280',

        // Aliases para compatibilidade total com os gradientes existentes
        'brand-purple': '#DA291C', // Mapeado para o Vermelho Patties
        'brand-pink': '#FFC72C',   // Mapeado para o Amarelo Mostarda Patties
        'brand-blue': '#D97706',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
