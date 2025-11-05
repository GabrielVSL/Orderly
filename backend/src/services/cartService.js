const { Cart, Product } = require('../models');

const addItemToCart = async (productId, quantity) => {
  const product = await Product.findByPk(productId);

  if (!product) {
    const error = new Error('Product not found.');
    error.status = 404;
    throw error;
  }

  const quantityToAdd = quantity || 1;
  let cartItem;

  try {
    // Find the item
    const existingItem = await Cart.findOne({ where: { productId: productId } });

    if (existingItem) { 
      // Update quantity
      const newQuantity = existingItem.quantity + quantityToAdd;
      if (newQuantity > 10) {
        const error = new Error('Quantity cannot exceed 10.');
        error.status = 400;
        throw error;
      }
      existingItem.quantity = newQuantity;
      cartItem = await existingItem.save(); 
    } else {
      // Create new item
      cartItem = await Cart.create({
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

    return fullCartItem; // This is the final, full item

  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const validationError = new Error(error.errors.map(e => e.message).join(', '));
      validationError.status = 400;
      throw validationError;
    }
    throw error;
  }
};

const getCartContents = async () => {
  try {
    const items = await Cart.findAll({
      include: [{
        model: Product,
        as: 'product'
      }]
    });
    return items;
  } catch (error) {
    throw new Error('Database error while fetching cart: ' + error.message);
  }
};

const removeItemFromCart = async (cartItemId) => {
  try {
    const item = await Cart.findByPk(cartItemId);
    if (!item) {
      const error = new Error('Cart item not found.');
      error.status = 404;
      throw error;
    }
    await item.destroy();
    return { status: 204 }; // sucessful deletion with no content
  } catch (error) {
    throw error;
  }
};

const updateItemQuantity = async (cartItemId, newQuantity) => {
  try {
    // validation
    if (newQuantity < 1) {
      const error = new Error('Quantity must be at least 1.');
      error.status = 400; // Bad Request
      throw error;
    }
    if (newQuantity > 10) {
      const error = new Error('Quantity cannot exceed 10.');
      error.status = 400;
      throw error;
    }

    // search item
    const item = await Cart.findByPk(cartItemId);
    if (!item) {
      const error = new Error('Cart item not found.');
      error.status = 404;
      throw error;
    }

    // update 
    item.quantity = newQuantity;
    await item.save();

    // fetch full item with new quantity
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

const checkoutCart = async () => {
  try {
    await Cart.destroy({ where: {} }); // Clear the cart

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