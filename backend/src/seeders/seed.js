const { sequelize, Product } = require('../models');

// SEED DATA
const productSeedData = [
  {
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and cheese.',
    price: 15.99,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop", // This one worked
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic tomato, mozzarella, and basil.',
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&h=600&fit=crop", // This one worked
  },
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine with parmesan and croutons.',
    price: 8.99,
    imageUrl: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
  },
  {
    name: 'Crispy Chicken Sandwich',
    description: 'Fried chicken breast with pickles and mayo.',
    price: 13.99,
    imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop", // This one worked
  },
  {
    name: 'Onion Rings',
    description: 'Golden-fried and perfectly seasoned.',
    price: 6.99,
    imageUrl: "https://images.unsplash.com/photo-1612487439058-0564e17f761b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=800h=600&dpr=1",
  },
  {
    name: 'Chocolate Milkshake',
    description: 'Thick, creamy, and topped with whipped cream.',
    price: 7.99,
    imageUrl: "https://images.unsplash.com/photo-1714799263245-4fc7cc21911e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1099",
  },
  {
    name: 'Fries',
    description: 'Crispy golden french fries.',
    price: 5.99,
    imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800&h=600&fit=crop", // This one worked
  },
  {
    name: 'Veggie Burger',
    description: 'A plant-based patty, avocado, and sprouts.',
    price: 18.99,
    imageUrl: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=800&h=600&fit=crop&crop=edges&gravity=south", // This one worked
  },
  { 
    name: 'Soda',
    description: 'Your choice of fountain drink.',
    price: 2.99,
    imageUrl: "https://images.unsplash.com/photo-1605548230624-8d2d0419c517?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=800&h=600&fit=crop",
  },
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