const { sequelize, Product } = require('../models');

// SEED DATA
const productSeedData = [
  {
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and cheese.',
    price: 15.99,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
    rating: 4.5
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic tomato, mozzarella, and basil.',
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&h=600&fit=crop",
    rating: 4.7
  },
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine with parmesan and croutons.',
    price: 8.99,
    imageUrl: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
    rating: 4.2
  },
  {
    name: 'Crispy Chicken Sandwich',
    description: 'Fried chicken breast with pickles and mayo.',
    price: 13.99,
    imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop",
    rating: 4.6
  },
  {
    name: 'Onion Rings',
    description: 'Golden-fried and perfectly seasoned.',
    price: 6.99,
    imageUrl: "https://images.unsplash.com/photo-1612487439058-0564e17f761b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=800h=600&dpr=1",
    rating: 4.3
  },
  {
    name: 'Chocolate Milkshake',
    description: 'Thick, creamy, and topped with whipped cream.',
    price: 7.99,
    imageUrl: "https://images.unsplash.com/photo-1714799263245-4fc7cc21911e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1099",
    rating: 4.8
  },
  {
    name: 'Fries',
    description: 'Crispy golden french fries.',
    price: 5.99,
    imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800&h=600&fit=crop",
    rating: 4.4
  },
  {
    name: 'Veggie Burger',
    description: 'A plant-based patty, avocado, and sprouts.',
    price: 18.99,
    imageUrl: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=800&h=600&fit=crop&crop=edges&gravity=south",
    rating: 4.1
  },
  { 
    name: 'Soda',
    description: 'Your choice of fountain drink.',
    price: 2.99,
    imageUrl: "https://images.unsplash.com/photo-1605548230624-8d2d0419c517?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=800&h=600&fit=crop",
    rating: 4.0
  },
  {
    name: 'Smartphone X',
    description: 'The latest smartphone with a stunning display.',
    price: 799.99,
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop",
    rating: 4.7
  },
  {
    name: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones.',
    price: 199.99,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
    rating: 4.6
  },
  {
    name: 'Elegant Wristwatch',
    description: 'A classic timepiece for any occasion.',
    price: 349.99,
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&h=600&fit=crop",
    rating: 4.8
  },
  {
    name: 'Compact Laptop Pro',
    description: 'Powerful and portable for work on the go.',
    price: 1199.99,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
    rating: 4.9
  },
  {
    name: 'Gaming Console Z',
    description: 'Next-generation gaming with 8K support.',
    price: 499.99,
    imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop",
    rating: 4.7
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic mouse with 2.4GHz wireless.',
    price: 25.99,
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&h=600&fit=crop",
    rating: 4.4
  },
  {
    name: 'USB-C Hub',
    description: '8-in-1 adapter for all your peripherals.',
    price: 49.99,
    imageUrl: "https://images.unsplash.com/photo-1564286027156-9ad736dfbbbb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=772",
    rating: 4.5
  },
  {
    name: 'Smart Speaker',
    description: 'Voice-controlled speaker with rich sound.',
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1586078875290-c22eb791ad5d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470",
    rating: 4.6
  },
  {
    name: 'Portable SSD',
    description: '1TB of blazing-fast external storage.',
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1628557118391-56cd62c9f2cb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=765",
    rating: 4.9
  },
  {
    name: 'Tablet Pro',
    description: 'A powerful tablet for creativity and productivity.',
    price: 649.99,
    imageUrl: "https://images.unsplash.com/photo-1607452258545-943d7243463c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470",
    rating: 4.7
  },
  {
    name: '4K Webcam',
    description: 'Crystal-clear video for your meetings.',
    price: 159.99,
    imageUrl: "https://images.unsplash.com/photo-1733218430878-902cc0cff502?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470",
    rating: 4.5
  },
  {
    name: 'Mechanical Keyboard',
    description: 'Clicky switches for a satisfying typing experience.',
    price: 119.99,
    imageUrl: "https://images.unsplash.com/photo-1602025882379-e01cf08baa51?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470",
    rating: 4.8
  }
];

// const userSeedData = [ ... ];

// SEEDERS
const seedProducts = () => {
  console.log('Seeding products...');
  return Product.bulkCreate(productSeedData);
};
// const seedUsers = () => {};

// run the seeders
const Seed = async () => {
  try {
    await sequelize.sync({ force: true }); // drops and recreates all tables
    console.log('Database synced! Tables dropped and recreated.');

    await Promise.all([
      seedProducts(),
      // add more seeders here as needed
    ]);
    console.log('All data seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
};

Seed();