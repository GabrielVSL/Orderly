const express = require('express');
const cors = require('cors');
const db = require('./models');
const sessionMiddleware = require('./middleware/sessionMiddleware');

// Import routes
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(sessionMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

async function startServer() {
  try { 
    await db.sequelize.sync(); 
    console.log('Banco de dados conectado e sincronizado.');

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
