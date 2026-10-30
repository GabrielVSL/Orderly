const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { validateCheckout } = require('../middleware/validation');

// POST /api/orders/validate-coupon - Valida cupom antes do checkout
router.post('/validate-coupon', orderController.checkCoupon);

// POST /api/orders/ - Cria pedido a partir do carrinho da sessão
router.post('/', validateCheckout, orderController.checkout);

// GET /api/orders/ - Histórico de pedidos da sessão
router.get('/', orderController.getSessionOrders);

// GET /api/orders/:orderNumber - Detalhes do pedido para rastreamento
router.get('/:orderNumber', orderController.getOrder);

// PATCH /api/orders/:orderNumber/status - Avanço de status (para rastreador)
router.patch('/:orderNumber/status', orderController.updateStatus);

module.exports = router;
