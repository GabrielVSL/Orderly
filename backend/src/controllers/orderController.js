const orderService = require('../services/orderService');

const checkout = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.sessionId, req.body);
    res.status(201).json({
      message: 'Pedido realizado com sucesso!',
      order
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await orderService.getOrderByNumber(orderNumber);
    res.status(200).json(order);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const getSessionOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrdersBySession(req.sessionId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { status } = req.body;
    const updatedOrder = await orderService.updateOrderStatus(orderNumber, status);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const checkCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const result = orderService.validateCoupon(code, subtotal);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

module.exports = {
  checkout,
  getOrder,
  getSessionOrders,
  updateStatus,
  checkCoupon
};
