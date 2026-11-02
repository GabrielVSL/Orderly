const jwt = require('jsonwebtoken');
const { User } = require('../models');

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('FATAL: Variável de ambiente JWT_SECRET é obrigatória em produção.');
}
const JWT_SECRET = process.env.JWT_SECRET || 'patties-burger-secret-key-2026';

// Middleware que detecta se há token JWT e anexa req.user (opcional para rotas mistas)
const extractUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (user) {
        req.user = user;
        req.userId = user.id;
      }
    } catch {
      // Token inválido ou expirado - segue como visitante
      req.user = null;
      req.userId = null;
    }
  }

  next();
};

// Middleware que EXIGE login ativo (401 caso não logado)
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acesso não autorizado. Por favor, faça login.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Usuário não localizado.' });
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch {
    return res.status(401).json({ message: 'Sessão expirada ou token inválido. Faça login novamente.' });
  }
};

module.exports = {
  extractUser,
  requireAuth,
  JWT_SECRET
};
