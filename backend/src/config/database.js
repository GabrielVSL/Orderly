const path = require('path');
// configuration for SQLite database sequelize
module.exports = {
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database/db.sqlite3') // Caminho para o arquivo do banco
};