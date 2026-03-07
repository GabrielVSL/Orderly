const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

let sequelize;

// Se a variável de ambiente existir (Estou rodando no Render!)
if (process.env.DATABASE_URL) {
  // Conecta no PostgreSQL usando a URL secreta + as regras de SSL
  sequelize = new Sequelize(process.env.DATABASE_URL, dbConfig);
} else {
  // Se não existir (Estou rodando no meu PC local!)
  // Conecta no SQLite usando apenas as configurações do arquivo
  sequelize = new Sequelize(dbConfig);
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load models
db.Product = require('./Product.js')(sequelize, Sequelize.DataTypes);
db.Cart = require('./Cart.js')(sequelize, Sequelize.DataTypes);

// Define associations
db.Product.hasMany(db.Cart, { as: 'cartItems', foreignKey: 'productId' }); 
db.Cart.belongsTo(db.Product, { foreignKey: 'productId', as: 'product' }); 

module.exports = db;