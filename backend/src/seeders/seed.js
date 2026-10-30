const { sequelize, Product } = require('../models');

const pattiesProductSeedData = [
  // --- BURGERS ---
  {
    name: 'Original Patties Burger',
    description: 'Pão artesanal tostado na manteiga, dois ultra smash burgers com crostinha crocante, queijo cheddar cremoso fundido, picles fatiados e molho especial.',
    price: 29.90,
    rating: 4.9,
    category: 'burgers',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Cheese Bacon Patties',
    description: 'Pão fofinho, duplo smash burger ultra prensado, queijo cheddar derretido e tiras crocantes de bacon defumado de primeira linha.',
    price: 34.90,
    rating: 4.8,
    category: 'burgers',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Triple Smash Monster',
    description: 'Três carnes smash burger fininhas e crocantes de chapa, triplo queijo cheddar e cebola douradinha chapeada na manteiga.',
    price: 39.90,
    rating: 4.9,
    category: 'burgers',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Crispy Chicken Patties',
    description: 'Frango empanado ultra crocante com tempero secreto da casa, maionese verde artesanal, picles e alface americana fresquinha.',
    price: 28.90,
    rating: 4.7,
    category: 'burgers',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Veggie Smash Burger',
    description: 'Blend vegetal de cogumelos e grão-de-bico prensado na chapa com crosta dourada, queijo derretido, tomate fresco e maionese de ervas.',
    price: 31.90,
    rating: 4.6,
    category: 'burgers',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=800&auto=format&fit=crop&q=80'
  },

  // --- COMBOS ---
  {
    name: 'Combo Original Clássico',
    description: '1 Original Patties Burger + 1 Porção Individual de Batata Skinny crocante + 1 Refrigerante em lata geladinho.',
    price: 44.90,
    rating: 5.0,
    category: 'combos',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Combo Duplo Bacon & Shake',
    description: '1 Cheese Bacon Patties + 1 Batata Skinny temperada + 1 Milkshake de Ovomaltine (300ml). A experiência completa!',
    price: 54.90,
    rating: 4.9,
    category: 'combos',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Combo Galera (2 Burgers + Fritas)',
    description: '1 Original Patties + 1 Cheese Bacon + 1 Batata Skinny Grande Compartilhável + 2 Refrigerantes em lata.',
    price: 79.90,
    rating: 4.8,
    category: 'combos',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&auto=format&fit=crop&q=80'
  },

  // --- SIDES / ACOMPANHAMENTOS ---
  {
    name: 'Batata Skinny Patties',
    description: 'A clássica batata fininha, sequinha e ultra crocante no estilo retrô, temperada com flor de sal marinho.',
    price: 14.90,
    rating: 4.8,
    category: 'sides',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Batata Skinny Cheddar & Bacon',
    description: 'Nossa batata fininha crocante coberta com calda de queijo cheddar cremoso aquecido e farofa crocante de bacon.',
    price: 22.90,
    rating: 4.9,
    category: 'sides',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Onion Rings Crocantes',
    description: 'Anéis de cebola fresca empanados em massa temperada leve e crocante, fritos no ponto perfeito.',
    price: 16.90,
    rating: 4.5,
    category: 'sides',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1639024471287-032f667712d5?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Molho Secreto Patties (60ml)',
    description: 'Nosso molho especial artesanal com toque defumado, mostarda suave e relish de picles picadinho.',
    price: 4.90,
    rating: 4.9,
    category: 'sides',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=800&auto=format&fit=crop&q=80'
  },

  // --- SHAKES ---
  {
    name: 'Milkshake Ovomaltine Crocante',
    description: 'Sorvete artesanal batido com leite integral, calda de chocolate e generosa camada de flocos crocantes de Ovomaltine (400ml).',
    price: 21.90,
    rating: 5.0,
    category: 'shakes',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Milkshake Frutas Vermelhas',
    description: 'Sorvete de baunilha cremoso batido com calda rústica artesanal de morango, amora e framboesa (400ml).',
    price: 22.90,
    rating: 4.7,
    category: 'shakes',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Milkshake Caramelo & Flor de Sal',
    description: 'Sorvete batido com calda aveludada de caramelo toffee artesanal e pitadinha de flor de sal para equilibrar (400ml).',
    price: 23.90,
    rating: 4.8,
    category: 'shakes',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=800&auto=format&fit=crop&q=80'
  },

  // --- BEBIDAS ---
  {
    name: 'Refrigerante em Lata (350ml)',
    description: 'Coca-Cola (Original ou Sem Açúcar), Guaraná Antarctica ou Sprite servidos bem gelados.',
    price: 6.90,
    rating: 4.6,
    category: 'drinks',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Refri Caçulinha Retrô (200ml)',
    description: 'A nostálgica garrafinha de vidro caçulinha dos anos 80/90. O puro sabor da infância.',
    price: 4.90,
    rating: 4.8,
    category: 'drinks',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Chá Gelado com Limão (500ml)',
    description: 'Chá preto feito na casa com suco de limão taiti fresco, folhas de hortelã e gelo.',
    price: 8.90,
    rating: 4.7,
    category: 'drinks',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop&q=80'
  },

  // --- SOBREMESAS ---
  {
    name: 'Cookie Quentinho com Chocolate Belga',
    description: 'Massa amanteigada clássica crocante nas bordas e macia no centro, recheada com gotas de chocolate belga.',
    price: 12.90,
    rating: 4.9,
    category: 'desserts',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Brownie Fudge com Brigadeiro Quente',
    description: 'Pedaço denso e molhadinho de brownie de cacau nobre, servido com calda de brigadeiro artesanal.',
    price: 15.90,
    rating: 4.9,
    category: 'desserts',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80'
  }
];

const seedProducts = () => {
  console.log(`Seeding ${pattiesProductSeedData.length} Patties Burger products...`);
  return Product.bulkCreate(pattiesProductSeedData);
};

const Seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced! All tables dropped and recreated with updated schema.');

    await seedProducts();
    console.log('All Patties Burger products seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
};

Seed();
