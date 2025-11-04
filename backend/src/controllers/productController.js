const { Product } = require('../models');

// GET /products
const list = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products: ' + error.message });
  }
};

module.exports = {
  list
  // other product controller methods
};