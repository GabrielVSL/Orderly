const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

// start Sequelize instance
const sequelize = new Sequelize(dbConfig);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load models
db.Product = require('./Product.js')(sequelize, Sequelize.DataTypes);
db.Cart = require('./Cart.js')(sequelize, Sequelize.DataTypes);

// Define associations
db.Product.hasMany(db.Cart, { as: 'cartItems', foreignKey: 'productId' }); // "A Product can be in many Cart items"
db.Cart.belongsTo(db.Product, { foreignKey: 'productId', as: 'product' }); // "A Cart item belongs to a single Product"

module.exports = db;