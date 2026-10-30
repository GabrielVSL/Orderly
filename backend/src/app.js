const express = require('express');
const cors = require('cors');
const db = require('./models'); // taking the index.js from models folder

// Import routes
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');

const app = express();
const PORT = process.env.PORT || 3001; // Port 3001 for not colliding with React's default 3000

app.use(cors());
app.use(express.json()); // To parse JSON bodies into JS objects

// Health check endpoint (ótimo para serviços de ping/uptime manterem o server acordado sem onerar o banco)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);


// functions 

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

startServer();
