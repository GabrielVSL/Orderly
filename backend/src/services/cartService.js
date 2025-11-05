const { Cart, Product } = require('../models');

const addItemToCart = async (productId, quantity) => {
  const product = await Product.findByPk(productId); // validate product exists
  if (!product) {
    const error = new Error('Product not found.');
    error.status = 404;
    throw error;
  }

  const existingItem = await Cart.findOne({ where: { productId: productId } });
  const quantityToAdd = quantity || 1; // Default to 1 if not provided

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantityToAdd;

    if(newQuantity > 10) {
      const error = new Error('Cannot add more than 10 units of a product to the cart.');
      error.status = 400;
      throw error;
    }

    existingItem.quantity = newQuantity;
    await existingItem.save(); // This will trigger validation
    return existingItem;
    
  } else {
      try {
        const newItem = await Cart.create({
          productId: productId,
          quantity: quantityToAdd, 
        });
        return newItem;

      } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          const validationError = new Error(error.errors.map(e => e.message).join(', '));
          validationError.status = 400;
          throw validationError;
        }
        throw error;
      }
   }
  };
  
const getCartContents = async () => {
  try {
    const items = await Cart.findAll();
    return items;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  addItemToCart,
  getCartContents,
};