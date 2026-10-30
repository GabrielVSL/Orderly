const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { validateAddToCart, validateUpdateQuantity } = require('../middleware/validation');

// GET /api/cart/
router.get('/', cartController.getCart);

// POST /api/cart/
router.post('/', validateAddToCart, cartController.addItem);

// DELETE /api/cart/:id
router.delete('/:id', cartController.removeItem);

// PUT /api/cart/:id
router.put('/:id', validateUpdateQuantity, cartController.updateItemQuantity);

module.exports = router;
