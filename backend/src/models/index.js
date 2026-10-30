const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, dbConfig);
} else {
  sequelize = new Sequelize(dbConfig);
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load models
db.Product = require('./Product.js')(sequelize, Sequelize.DataTypes);
db.Cart = require('./Cart.js')(sequelize, Sequelize.DataTypes);
db.Order = require('./Order.js')(sequelize, Sequelize.DataTypes);
db.OrderItem = require('./OrderItem.js')(sequelize, Sequelize.DataTypes);

// Associations: Cart & Products
db.Product.hasMany(db.Cart, { as: 'cartItems', foreignKey: 'productId' }); 
db.Cart.belongsTo(db.Product, { foreignKey: 'productId', as: 'product' }); 

// Associations: Orders & OrderItems
db.Order.hasMany(db.OrderItem, { as: 'items', foreignKey: 'orderId', onDelete: 'CASCADE' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'orderId', as: 'order' });
db.OrderItem.belongsTo(db.Product, { foreignKey: 'productId', as: 'product' });

module.exports = db;
