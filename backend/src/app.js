require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./models');
const sessionMiddleware = require('./middleware/sessionMiddleware');
const { extractUser } = require('./middleware/authMiddleware');

// Import routes
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const authRoutes = require('./routes/auth');
const mailService = require('./services/mailService');

const app = express();
const PORT = process.env.PORT || 3001;

// SEC-06: Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// SEC-07: Configuração restrita de CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origem não permitida pelo CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(sessionMiddleware);
app.use(extractUser);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SEC-08: Preview visual dos e-mails apenas fora de produção
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/preview-email', (req, res) => {
    const type = req.query.type || 'order';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (type === 'reset') {
      return res.send(mailService.generatePasswordResetHtml({ name: 'Gabriel Teste' }));
    }
    if (type === 'welcome') {
      return res.send(mailService.generateWelcomeHtml({ name: 'Gabriel Teste' }));
    }
    return res.send(mailService.generateOrderConfirmationHtml());
  });
}

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

async function ensureDatabaseSchema() {
  const queryInterface = db.sequelize.getQueryInterface();

  const safeAddColumn = async (table, column, definition) => {
    try {
      const tableDesc = await queryInterface.describeTable(table);
      if (!tableDesc[column]) {
        await queryInterface.addColumn(table, column, definition);
      }
    } catch {
      // Tabela ainda não existe antes do sync inicial
    }
  };

  await safeAddColumn('orders', 'userId', { type: db.Sequelize.INTEGER, allowNull: true });
  await safeAddColumn('cart_items', 'notes', { type: db.Sequelize.TEXT, allowNull: true });
  await safeAddColumn('order_items', 'notes', { type: db.Sequelize.TEXT, allowNull: true });
  await safeAddColumn('users', 'resetPasswordToken', { type: db.Sequelize.STRING, allowNull: true });
  await safeAddColumn('users', 'resetPasswordExpires', { type: db.Sequelize.DATE, allowNull: true });
}

async function startServer() {
  try { 
    await ensureDatabaseSchema();
    await db.sequelize.sync(); 
    console.log('Banco de dados conectado e sincronizado.');

    // Auto-seed: se o banco estiver vazio (ex: novo clone ou ambiente sem seed), popula automaticamente
    const count = await db.Product.count();
    if (count === 0) {
      console.log('Banco de dados sem produtos. Executando seed automático oficial do Patties...');
      const { pattiesProductSeedData } = require('./seeders/seed');
      await db.Product.bulkCreate(pattiesProductSeedData);
      console.log(`Auto-seed concluído com sucesso: ${pattiesProductSeedData.length} produtos cadastrados.`);
    }

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
