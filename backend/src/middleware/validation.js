const validateAddToCart = (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId || isNaN(productId) || Number(productId) <= 0) {
    return res.status(400).json({ message: 'Um ID de produto válido é obrigatório.' });
  }

  if (quantity !== undefined) {
    const qty = Number(quantity);
    if (isNaN(qty) || !Number.isInteger(qty) || qty < 1 || qty > 10) {
      return res.status(400).json({ message: 'A quantidade deve ser um número inteiro entre 1 e 10.' });
    }
  }

  next();
};

const validateUpdateQuantity = (req, res, next) => {
  const { quantity } = req.body;
  const qty = Number(quantity);

  if (quantity === undefined || isNaN(qty) || !Number.isInteger(qty) || qty < 1 || qty > 10) {
    return res.status(400).json({ message: 'A quantidade deve ser um número inteiro entre 1 e 10.' });
  }

  next();
};

const validateCheckout = (req, res, next) => {
  const { name, email, phone, address, paymentMethod } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ message: 'Por favor, informe seu nome completo (mínimo 2 caracteres).' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return res.status(400).json({ message: 'Por favor, informe um endereço de e-mail válido.' });
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
    return res.status(400).json({ message: 'Por favor, informe um número de telefone/WhatsApp válido.' });
  }

  if (!address || typeof address !== 'string' || address.trim().length < 5) {
    return res.status(400).json({ message: 'Por favor, informe um endereço de entrega completo.' });
  }

  if (paymentMethod && !['pix', 'card', 'cash'].includes(paymentMethod)) {
    return res.status(400).json({ message: 'Forma de pagamento inválida. Escolha pix, card ou cash.' });
  }

  next();
};

module.exports = {
  validateAddToCart,
  validateUpdateQuantity,
  validateCheckout,
};
