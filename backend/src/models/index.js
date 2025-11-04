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

// assosciations ex: db.User.hasMany(db.Post);

module.exports = db;