const cartService = require('../services/cartService');

const addItem = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const newItem = await cartService.addItemToCart(productId, quantity);
    res.status(201).json(newItem);

  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const items = await cartService.getCartContents();
    res.status(200).json(items);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const removeItem = async (req, res) => {
  const { id } = req.params;
  try {
    await cartService.removeItemFromCart(id);
    res.status(204).send(); // successful delete
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const updateItemQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const updatedItem = await cartService.updateItemQuantity(id, quantity);
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  addItem,
  getCart,
  removeItem,
  updateItemQuantity
};