const path = require('path');

// Se a variável DATABASE_URL existir (como lá no Render), ele usa o PostgreSQL
if (process.env.DATABASE_URL) {
  module.exports = {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Obrigatório para bancos de dados em nuvem
      }
    }
  };
} else {
  // Se não existir (na sua máquina), ele continua usando o seu SQLite original
  module.exports = {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database/db.sqlite3') // Caminho para o arquivo do banco
  };
}