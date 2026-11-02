export const brandConfig = {
  name: 'Patties',
  fullName: 'Patties Burger',
  tagline: 'Making burger like old times',
  subTagline: 'Hambúrguer de verdade, do jeito que era feito antigamente.',
  slogan: 'O primeiro smash burger do Brasil. Pão tostado na manteiga de garrafa, carne ultra prensada com crostinha crocante e queijo derretido.',
  logoUrl: 'https://pattiesburger.com/wp-content/uploads/2019/08/patties-burger-2-1.png',
  heroImage: '/images/hero.png',
  storefrontImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2560&auto=format&fit=crop',
  instagram: '@pattiesburger',
  instagramUrl: 'https://www.instagram.com/pattiesburger/',
  websiteUrl: 'https://pattiesburger.com/',
  currency: 'BRL',
  freeDeliveryThreshold: 50.00,
  defaultDeliveryFee: 7.90,
  courier: {
    serviceName: 'Entregador Patties Express',
    name: 'Carlos Eduardo',
    vehicle: 'Honda CG 160 Fan • Placa PAT-2026',
    rating: '4.9',
    iconUrl: '/images/delivery-motorcycle.png'
  },
  colors: {
    primary: '#D71920',       // Patties Red oficial
    primaryHover: '#B71218',
    secondary: '#FEDB00',     // Patties Yellow oficial
    secondaryHover: '#F5D000',
    background: '#F8F5EE',    // Warm Paper Canvas
    surface: '#FFFFFF',
    textMain: '#141413',      // Carvão Editorial
    textMuted: '#73706A',
    border: 'rgba(20, 20, 19, 0.1)',
  },
  categories: [
    { id: 'todos', label: 'Todos os Itens' },
    { id: 'lanches', label: 'Lanches Smash' },
    { id: '4up', label: 'Linha 4-UP (Monster)' },
    { id: 'combos', label: 'Combos Completos' },
    { id: 'frango', label: 'Frango & Bites' },
    { id: 'batatas', label: 'Batatas Skinny' },
    { id: 'bebidas', label: 'Refrescos & Bebidas' },
    { id: 'sobremesas', label: 'Shakes & Sobremesas' },
  ],
  stores: [
    { name: 'Brooklin', address: 'Rua Flórida, 1420 - Brooklin, São Paulo' },
    { name: 'Pinheiros', address: 'Rua dos Pinheiros, 875 - Pinheiros, São Paulo' },
    { name: 'Pampulha', address: 'Av. Fleming, 800 - Pampulha, Belo Horizonte' },
    { name: 'Savassi', address: 'Av. Cristóvão Colombo, 480 - Savassi, Belo Horizonte' },
  ],
  coupons: [
    { code: 'PATTIES10', label: '10% OFF no pedido', discountText: '10% de desconto' },
    { code: 'PRIMEIRACOMPRA', label: '15% OFF de Boas-Vindas', discountText: '15% de desconto' },
    { code: 'FRETEGRATIS', label: 'Frete Grátis garantido', discountText: 'Frete Grátis' },
  ]
};

export default brandConfig;
