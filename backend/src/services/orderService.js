const { sequelize, Order, OrderItem, Cart, Product } = require('../models');

// Cupons suportados
const VALID_COUPONS = {
  PATTIES10: { type: 'percent', value: 10, description: '10% de desconto no pedido' },
  PRIMEIRACOMPRA: { type: 'percent', value: 15, description: '15% de desconto de boas-vindas' },
  FRETEGRATIS: { type: 'free_shipping', value: 100, description: 'Frete Grátis garantido' },
};

const calculateCouponDiscount = (couponCode, subtotal, deliveryFee) => {
  if (!couponCode) return { code: null, discountAmount: 0, message: null };

  const normalized = couponCode.trim().toUpperCase();
  const coupon = VALID_COUPONS[normalized];

  if (!coupon) {
    return { code: null, discountAmount: 0, message: 'Cupom inválido ou expirado.' };
  }

  if (coupon.type === 'percent') {
    const discount = (Number(subtotal) * (coupon.value / 100));
    return {
      code: normalized,
      discountAmount: Number(discount.toFixed(2)),
      message: `Cupom ${normalized} aplicado: ${coupon.description}`
    };
  }

  if (coupon.type === 'free_shipping') {
    return {
      code: normalized,
      discountAmount: Number(deliveryFee),
      message: `Cupom ${normalized} aplicado: ${coupon.description}`
    };
  }

  return { code: null, discountAmount: 0, message: null };
};

const validateCoupon = (couponCode, subtotal = 0, deliveryFee = 7.90) => {
  if (!couponCode || !couponCode.trim()) {
    const error = new Error('Por favor, informe o código do cupom.');
    error.status = 400;
    throw error;
  }

  const result = calculateCouponDiscount(couponCode, subtotal, deliveryFee);
  if (!result.code) {
    const error = new Error(result.message || 'Cupom inválido.');
    error.status = 400;
    throw error;
  }

  return result;
};

const generateOrderNumber = () => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `PAT-${randomSuffix}`;
};

const createOrder = async (sessionId, checkoutData) => {
  const transaction = await sequelize.transaction();

  try {
    // 1. Buscar itens do carrinho da sessão
    const cartItems = await Cart.findAll({
      where: { sessionId: sessionId },
      include: [{ model: Product, as: 'product' }],
      transaction
    });

    if (!cartItems || cartItems.length === 0) {
      const error = new Error('Seu carrinho está vazio. Adicione itens antes de finalizar o pedido.');
      error.status = 400;
      throw error;
    }

    // 2. Calcular subtotal
    const subtotal = cartItems.reduce((acc, item) => {
      const price = Number(item.product.price);
      return acc + (price * item.quantity);
    }, 0);

    // 3. Regra de frete: Grátis acima de R$ 50,00, senão R$ 7,90
    let deliveryFee = subtotal >= 50.00 ? 0.00 : 7.90;

    // 4. Calcular cupom de desconto se enviado
    let discountAmount = 0.00;
    let validCouponCode = null;

    if (checkoutData.couponCode) {
      const couponResult = calculateCouponDiscount(checkoutData.couponCode, subtotal, deliveryFee);
      if (couponResult.code) {
        validCouponCode = couponResult.code;
        discountAmount = couponResult.discountAmount;
      }
    }

    const totalAmount = Math.max(0, subtotal + deliveryFee - discountAmount);

    // 5. Criar registro de Order
    const orderNumber = generateOrderNumber();

    const newOrder = await Order.create({
      orderNumber,
      sessionId,
      customerName: checkoutData.name.trim(),
      customerEmail: checkoutData.email.trim(),
      customerPhone: checkoutData.phone.trim(),
      deliveryAddress: checkoutData.address.trim(),
      notes: checkoutData.notes ? checkoutData.notes.trim() : null,
      paymentMethod: checkoutData.paymentMethod || 'pix',
      couponCode: validCouponCode,
      discountAmount: Number(discountAmount.toFixed(2)),
      subtotal: Number(subtotal.toFixed(2)),
      deliveryFee: Number(deliveryFee.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      status: 'received'
    }, { transaction });

    // 6. Criar registros de OrderItems (Snapshot histórico)
    const orderItemsData = cartItems.map(item => ({
      orderId: newOrder.id,
      productId: item.productId,
      productName: item.product.name,
      productImageUrl: item.product.imageUrl,
      unitPrice: Number(item.product.price),
      quantity: item.quantity
    }));

    await OrderItem.bulkCreate(orderItemsData, { transaction });

    // 7. Limpar o carrinho dessa sessão
    await Cart.destroy({
      where: { sessionId: sessionId },
      transaction
    });

    await transaction.commit();

    // 8. Buscar o pedido criado completo com os itens
    const fullOrder = await Order.findByPk(newOrder.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    return fullOrder;

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getOrderByNumber = async (orderNumber) => {
  try {
    const order = await Order.findOne({
      where: { orderNumber: orderNumber.trim().toUpperCase() },
      include: [{ model: OrderItem, as: 'items' }]
    });

    if (!order) {
      const error = new Error('Pedido não encontrado.');
      error.status = 404;
      throw error;
    }

    return order;
  } catch (error) {
    throw error;
  }
};

const getOrdersBySession = async (sessionId) => {
  try {
    const orders = await Order.findAll({
      where: { sessionId: sessionId },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });
    return orders;
  } catch (error) {
    throw new Error('Erro ao buscar pedidos da sessão: ' + error.message);
  }
};

const updateOrderStatus = async (orderNumber, newStatus) => {
  const validStatuses = ['received', 'preparing', 'packing', 'delivering', 'delivered'];
  if (!validStatuses.includes(newStatus)) {
    const error = new Error(`Status inválido. Escolha entre: ${validStatuses.join(', ')}`);
    error.status = 400;
    throw error;
  }

  const order = await Order.findOne({
    where: { orderNumber: orderNumber.trim().toUpperCase() }
  });

  if (!order) {
    const error = new Error('Pedido não encontrado.');
    error.status = 404;
    throw error;
  }

  order.status = newStatus;
  await order.save();

  return Order.findByPk(order.id, {
    include: [{ model: OrderItem, as: 'items' }]
  });
};

module.exports = {
  createOrder,
  getOrderByNumber,
  getOrdersBySession,
  updateOrderStatus,
  validateCoupon,
  VALID_COUPONS
};
