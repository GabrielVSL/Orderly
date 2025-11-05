const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// GET /api/cart/
router.get('/', cartController.getCart);

// POST /api/cart/
router.post('/', cartController.addItem);

module.exports = router;