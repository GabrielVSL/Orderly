/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Dosis', 'sans-serif'],
        display: ['Cinzel', 'Playfair Display', 'serif'],
        serif: ['Playfair Display', 'Cinzel', 'serif'],
        script: ['Pacifico', 'cursive'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      colors: {
        // Paleta Editorial Patties Burger
        'patties-red': '#D71920',
        'patties-red-dark': '#B71218',
        'patties-red-soft': '#FDF2F2',
        'patties-yellow': '#FEDB00',
        'patties-yellow-warm': '#F5D000',
        'patties-yellow-soft': '#FFFBE6',
        'patties-paper': '#F8F5EE',
        'patties-card': '#FFFFFF',
        'patties-kraft': '#EFE9DD',
        'patties-charcoal': '#141413',
        'patties-muted': '#73706A',

        // Mapeamentos de compatibilidade
        'brand-red': '#D71920',
        'brand-yellow': '#FEDB00',
        'brand-cream': '#F8F5EE',
        'brand-dark': '#141413',
        'brand-light': '#F8F5EE',
        'brand-gray': '#73706A',

        // Cores secundárias diner
        'brand-purple': '#D71920',
        'brand-pink': '#FEDB00',
        'brand-blue': '#D71920',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(20, 20, 19, 0.05), 0 4px 6px -2px rgba(20, 20, 19, 0.02)',
        'elevated': '0 10px 30px -5px rgba(20, 20, 19, 0.08), 0 4px 10px -2px rgba(20, 20, 19, 0.04)',
        'floating': '0 20px 40px -10px rgba(20, 20, 19, 0.12)',
        'card': '0 1px 3px rgba(20, 20, 19, 0.04), 0 1px 2px rgba(20, 20, 19, 0.02)',
        'card-hover': '0 12px 28px -4px rgba(20, 20, 19, 0.1), 0 4px 12px -2px rgba(20, 20, 19, 0.04)',
        'badge-red': '0 2px 8px rgba(215, 25, 32, 0.25)',
        'badge-yellow': '0 2px 8px rgba(254, 219, 0, 0.3)',
      },
      borderRadius: {
        'card': '20px',
        'button': '14px',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
}
