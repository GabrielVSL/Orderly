const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// GET /api/cart/
router.get('/', cartController.getCart);

// POST /api/cart/
router.post('/', cartController.addItem);

// DELETE /api/cart/:id
router.delete('/:id', cartController.removeItem);

// PUT /api/cart/:id
router.put('/:id', cartController.updateItemQuantity);

module.exports = router;