const { Product } = require('../models');

const getAllProducts = async () => {
  try {
    const products = await Product.findAll();
    return products;
  } catch (error) {
    throw new Error('Database error while fetching products: ' + error.message);
  }
};

// Future product-related service functions...

module.exports = {
  getAllProducts,
};