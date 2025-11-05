const orderService = require('../services/orderService');

const checkout = async (req, res) => {
  try {
    const result = await orderService.processCheckout();
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  checkout,
};