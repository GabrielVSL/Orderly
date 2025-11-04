// const { Cart } = require('../models'); // not using it yet

// GET /cart - example endpoint to get cart details
const getCart = async (req, res) => {
  try {
    res.status(200).json({ message: 'Endpoint /cart is working!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart
  // more methods here
};