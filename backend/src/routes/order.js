// src/routes/order.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /api/orders/ - simulate checkout
router.post('/', orderController.checkout);

module.exports = router;