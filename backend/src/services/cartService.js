const { Cart, Product } = require('../models');

const addItemToCart = async (sessionId, productId, quantity) => {
  const product = await Product.findByPk(productId);

  if (!product) {
    const error = new Error('Product not found.');
    error.status = 404;
    throw error;
  }

  const quantityToAdd = quantity || 1;
  let cartItem;

  try {
    // Find the item scoped to the user's session
    const existingItem = await Cart.findOne({ 
      where: { 
        sessionId: sessionId, 
        productId: productId 
      } 
    });

    if (existingItem) { 
      const newQuantity = existingItem.quantity + quantityToAdd;
      if (newQuantity > 10) {
        const error = new Error('Quantity cannot exceed 10.');
        error.status = 400;
        throw error;
      }
      existingItem.quantity = newQuantity;
      cartItem = await existingItem.save(); 
    } else {
      if (quantityToAdd > 10) {
        const error = new Error('Quantity cannot exceed 10.');
        error.status = 400;
        throw error;
      }
      cartItem = await Cart.create({
        sessionId: sessionId,
        productId: productId,
        quantity: quantityToAdd,
      });
    }

    // Refresh to include Product data
    const fullCartItem = await Cart.findByPk(cartItem.id, {
      include: [{
        model: Product,
        as: 'product'
      }]
    });

    return fullCartItem;

  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const validationError = new Error(error.errors.map(e => e.message).join(', '));
      validationError.status = 400;
      throw validationError;
    }
    throw error;
  }
};

const getCartContents = async (sessionId) => {
  try {
    const items = await Cart.findAll({
      where: { sessionId: sessionId },
      include: [{
        model: Product,
        as: 'product'
      }],
      order: [['createdAt', 'ASC']]
    });
    return items;
  } catch (error) {
    throw new Error('Database error while fetching cart: ' + error.message);
  }
};

const removeItemFromCart = async (sessionId, cartItemId) => {
  try {
    const item = await Cart.findOne({
      where: { 
        id: cartItemId,
        sessionId: sessionId 
      }
    });

    if (!item) {
      const error = new Error('Cart item not found in this session.');
      error.status = 404;
      throw error;
    }

    await item.destroy();
    return { status: 204 };
  } catch (error) {
    throw error;
  }
};

const updateItemQuantity = async (sessionId, cartItemId, newQuantity) => {
  try {
    if (newQuantity < 1) {
      const error = new Error('Quantity must be at least 1.');
      error.status = 400;
      throw error;
    }
    if (newQuantity > 10) {
      const error = new Error('Quantity cannot exceed 10.');
      error.status = 400;
      throw error;
    }

    const item = await Cart.findOne({
      where: { 
        id: cartItemId,
        sessionId: sessionId 
      }
    });

    if (!item) {
      const error = new Error('Cart item not found in this session.');
      error.status = 404;
      throw error;
    }

    item.quantity = newQuantity;
    await item.save();

    const fullCartItem = await Cart.findByPk(item.id, {
      include: [{ model: Product, as: 'product' }]
    });
    
    return fullCartItem;

  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const validationError = new Error(error.errors.map(e => e.message).join(', '));
      validationError.status = 400;
      throw validationError;
    }
    throw error;
  }
};

const checkoutCart = async (sessionId) => {
  try {
    await Cart.destroy({ where: { sessionId: sessionId } });
    return { message: 'Checkout simulated successfully!' };
  } catch (error) {
    throw new Error('Error during checkout: ' + error.message);
  }
};

module.exports = {
  addItemToCart,
  getCartContents,
  removeItemFromCart,
  updateItemQuantity,
  checkoutCart
};
