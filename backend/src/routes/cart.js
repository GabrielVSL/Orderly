const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// GET /api/cart/ - get cart items
router.get('/', cartController.getCart);

// other cart routes are going here

module.exports = router;