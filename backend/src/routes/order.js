// src/routes/order.js
const express = require('express');
const router = express.Router();

// POST /api/orders/ - simulate checkout
router.post('/', (req, res) => {
  res.status(200).json({ message: 'Checkout simulado com sucesso!' });
});

module.exports = router;