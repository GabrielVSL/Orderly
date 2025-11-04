const { sequelize, Product } = require('../models');

// SEED DATA
const productSeedData = [
  {
    name: 'Classic Burger',
    description: 'A juicy beef patty with lettuce, tomato, and cheese.',
    price: 15.99,
  },
  {
    name: 'Veggie Burger',
    description: 'A plant-based patty, avocado, and sprouts.',
    price: 18.99,
  },
  {
    name: 'Fries',
    description: 'Crispy golden french fries.',
    price: 5.99,
  },
  {
    name: 'Soda',
    description: 'Your choice of fountain drink.',
    price: 2.99,
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