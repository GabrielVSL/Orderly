// src/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products/ - get product list
router.get('/', productController.list);

module.exports = router;