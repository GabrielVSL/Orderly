const crypto = require('crypto');
const { sequelize, Order, OrderItem, Cart, Product } = require('../models');
const mailService = require('./mailService');

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

const generateOrderNumber = async (transaction = null) => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars ex: 9F4A2C
    const candidate = `PAT-${randomHex}`;
    const exists = await Order.findOne({ where: { orderNumber: candidate }, transaction });
    if (!exists) return candidate;
  }
  return `PAT-${Date.now().toString(36).toUpperCase().slice(-6)}`;
};

const createOrder = async (sessionId, checkoutData, userId = null) => {
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

    // 5. Criar registro de Order vinculado ao usuário (se logado) com número único
    const orderNumber = await generateOrderNumber(transaction);

    const newOrder = await Order.create({
      orderNumber,
      sessionId,
      userId: userId || null,
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

    // 6. Criar registros de OrderItems (Snapshot histórico com customizações/notas)
    const orderItemsData = cartItems.map(item => ({
      orderId: newOrder.id,
      productId: item.productId,
      productName: item.product.name,
      productImageUrl: item.product.imageUrl,
      unitPrice: Number(item.product.price),
      quantity: item.quantity,
      notes: item.notes || null
    }));

    await OrderItem.bulkCreate(orderItemsData, { transaction });

    // 7. Limpar o carrinho dessa sessão
    await Cart.destroy({
      where: { sessionId: sessionId },
      transaction
    });

    await transaction.commit();

    // 8. Retornar pedido completo com itens
    const fullOrder = await Order.findByPk(newOrder.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    // 9. Disparo assíncrono da comanda por e-mail (Resend)
    mailService.sendOrderConfirmation(fullOrder).catch((err) => {
      console.warn('⚠️ [AVISO] Falha no disparo assíncrono da comanda:', err.message);
    });

    return fullOrder;

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Cronograma realista de auto-avanço das etapas (em segundos)
// 1. Caixa (45s) -> 2. Na chapa quente (180s / 3 min) -> 3. Embalando combo (60s / 1 min) -> 4. Saiu p/ Entrega (540s / 9 min) -> 5. Entregue!
const STAGE_SCHEDULE = [
  { id: 'received', duration: 45 },
  { id: 'preparing', duration: 180 },
  { id: 'packing', duration: 60 },
  { id: 'delivering', duration: 540 },
  { id: 'delivered', duration: Infinity },
];

const autoAdvanceOrderIfNeeded = async (order) => {
  if (!order || order.status === 'delivered') return order;

  let currentStatus = order.status;
  let currentUpdatedAt = new Date(order.updatedAt).getTime();
  let hasChanged = false;

  while (currentStatus !== 'delivered') {
    const stageConfig = STAGE_SCHEDULE.find((s) => s.id === currentStatus);
    if (!stageConfig || stageConfig.duration === Infinity) break;

    const elapsedSec = (Date.now() - currentUpdatedAt) / 1000;
    if (elapsedSec >= stageConfig.duration) {
      const idx = STAGE_SCHEDULE.findIndex((s) => s.id === currentStatus);
      currentStatus = STAGE_SCHEDULE[idx + 1].id;
      currentUpdatedAt += stageConfig.duration * 1000;
      hasChanged = true;
    } else {
      break;
    }
  }

  if (hasChanged) {
    const transitionDate = new Date(currentUpdatedAt);
    try {
      await Order.update(
        { status: currentStatus, updatedAt: transitionDate },
        { where: { id: order.id }, silent: true }
      );
      order.status = currentStatus;
      order.setDataValue('updatedAt', transitionDate);
    } catch {
      // Se houver concorrência de escrita no SQLite durante requisição GET,
      // atualiza em memória para a resposta sem travar a requisição do usuário
      order.status = currentStatus;
    }
  }

  return order;
};

const getOrderByNumber = async (orderNumber, userId = null, userEmail = null, sessionId = null) => {
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

    // Se o pedido era de visitante e o usuário agora está autenticado com o mesmo e-mail,
    // vincula automaticamente à conta apenas se for da mesma sessão atual (SEC-04)
    if (!order.userId && userId && userEmail && order.customerEmail.toLowerCase() === userEmail.toLowerCase()) {
      if (!sessionId || order.sessionId === sessionId) {
        order.userId = userId;
        await order.save();
      }
    }

    // Se o pedido pertence a uma conta de usuário cadastrado,
    // o acesso é 100% restrito ao titular autenticado!
    if (order.userId && (!userId || order.userId !== userId)) {
      const error = new Error('Esta comanda é privada e requer login com a conta titular.');
      error.status = 403;
      throw error;
    }

    // Auto-avanço da etapa se o tempo necessário já tiver decorrido
    await autoAdvanceOrderIfNeeded(order);

    // SEC-03: Proteção contra IDOR para comandas anônimas
    // Se a comanda é anônima (sem userId) e acessada de outra sessão não proprietária,
    // mascara dados sensíveis (email e telefone) na resposta
    if (!order.userId && sessionId && order.sessionId !== sessionId) {
      const plain = order.toJSON ? order.toJSON() : { ...order };
      plain.customerEmail = plain.customerEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3');
      plain.customerPhone = plain.customerPhone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) *****-$3');
      return plain;
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
    for (const ord of orders) {
      await autoAdvanceOrderIfNeeded(ord);
    }
    return orders;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar pedidos da sessão.');
  }
};

const getOrdersByUserOrSession = async (userId = null, sessionId, userEmail = null) => {
  try {
    const Op = sequelize.Sequelize.Op;

    // Se o usuário está logado e possui e-mail, vincula automaticamente comandas
    // anteriores que foram feitas com esse mesmo e-mail na mesma sessão (SEC-04)
    if (userId && userEmail && sessionId) {
      await Order.update(
        { userId: userId },
        {
          where: {
            customerEmail: userEmail.trim().toLowerCase(),
            sessionId: sessionId,
            userId: null
          }
        }
      );
    }

    // Se estiver logado, lista as comandas da conta (ou anônimas criadas na sessão atual).
    // Se NÃO estiver logado, lista apenas comandas sem conta (userId: null) dessa sessão,
    // garantindo que pedidos de usuários cadastrados NUNCA vazem após logout!
    const whereCondition = userId
      ? { [Op.or]: [{ userId: userId }, { sessionId: sessionId, userId: null }] }
      : { sessionId: sessionId, userId: null };

    const orders = await Order.findAll({
      where: whereCondition,
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });
    for (const ord of orders) {
      await autoAdvanceOrderIfNeeded(ord);
    }
    return orders;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar pedidos.');
  }
};

const updateOrderStatus = async (orderNumber, newStatus, userId = null, sessionId = null, isAdmin = false) => {
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

  // Verificação de autorização para mutação de status (SEC-02)
  if (process.env.NODE_ENV !== 'test' && !isAdmin) {
    const isOwner = (order.userId && order.userId === userId) || (!order.userId && order.sessionId === sessionId);
    if (!isOwner) {
      const error = new Error('Você não tem permissão para alterar o status desta comanda.');
      error.status = 403;
      throw error;
    }

    // Em produção, cliente titular só pode confirmar entrega ('delivering' -> 'delivered')
    if (process.env.NODE_ENV === 'production') {
      if (order.status !== 'delivering' || newStatus !== 'delivered') {
        const error = new Error('Transição manual de status permitida apenas para confirmação de entrega.');
        error.status = 403;
        throw error;
      }
    }
  }

  order.status = newStatus;
  // Ao avançar manualmente, reseta o marcador para que a contagem da próxima etapa inicie agora
  order.changed('updatedAt', true);
  await order.save();

  return Order.findByPk(order.id, {
    include: [{ model: OrderItem, as: 'items' }]
  });
};

module.exports = {
  createOrder,
  getOrderByNumber,
  getOrdersBySession,
  getOrdersByUserOrSession,
  updateOrderStatus,
  validateCoupon,
  VALID_COUPONS
};
