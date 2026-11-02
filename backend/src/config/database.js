const path = require('path');

// Se a variável DATABASE_URL existir (como lá no Render), ele usa o PostgreSQL
if (process.env.DATABASE_URL) {
  module.exports = {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  };
} else {
  // Se for ambiente de testes, usa SQLite em memória para não limpar os dados de desenvolvimento
  module.exports = {
    dialect: 'sqlite',
    storage: process.env.NODE_ENV === 'test' 
      ? ':memory:' 
      : path.join(__dirname, '../../database/db.sqlite3'),
    logging: false
  };
}
