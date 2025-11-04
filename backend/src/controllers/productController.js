// const { Product } = require('../models'); // not using it yet

// GET /products - example endpoint to get product list
const list = async (req, res) => {
  try {
    res.status(200).json({ message: 'Endpoint /products is working!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  list
  // other product controller methods
};