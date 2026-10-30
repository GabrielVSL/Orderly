const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products/ - get product list with optional filters
router.get('/', productController.list);

// GET /api/products/:id - get single product
router.get('/:id', productController.getById);

module.exports = router;
