export const brandConfig = {
  name: 'Patties',
  fullName: 'Patties Burger Direct',
  tagline: 'O verdadeiro Ultra Smash Burger',
  slogan: 'Pão fofinho tostado na manteiga, carne ultra prensada com crostinha crocante e queijo derretido. O sabor retrô entregue quentinho na sua porta.',
  currency: 'BRL',
  freeDeliveryThreshold: 50.00,
  defaultDeliveryFee: 7.90,
  colors: {
    primary: '#DA291C',       // Vermelho clássico
    primaryHover: '#B91C1C',
    secondary: '#FFC72C',     // Amarelo mostarda
    secondaryHover: '#EAB308',
    background: '#FAF6EE',    // Off-white creme vintage
    surface: '#FFFFFF',
    textMain: '#1E1B18',      // Carvão vintage
    textMuted: '#6B7280',
    accentBorder: '#FDE047',
  },
  categories: [
    { id: 'todos', label: 'Cardápio Completo', icon: 'SparklesIcon' },
    { id: 'burgers', label: 'Smash Burgers', icon: 'FireIcon' },
    { id: 'combos', label: 'Combos', icon: 'StarIcon' },
    { id: 'sides', label: 'Batatas & Sides', icon: 'CubeIcon' },
    { id: 'shakes', label: 'Milkshakes', icon: 'HeartIcon' },
    { id: 'drinks', label: 'Bebidas', icon: 'BeakerIcon' },
    { id: 'desserts', label: 'Sobremesas', icon: 'CakeIcon' },
  ],
  coupons: [
    { code: 'PATTIES10', label: '10% OFF no pedido', discountText: '10% de desconto' },
    { code: 'PRIMEIRACOMPRA', label: '15% OFF de Boas-Vindas', discountText: '15% de desconto' },
    { code: 'FRETEGRATIS', label: 'Frete Grátis', discountText: 'Frete Grátis' },
  ]
};

export default brandConfig;
