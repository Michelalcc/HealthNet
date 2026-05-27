const { Pool } = require('pg');

const pool = new Pool({
  user: 'michelalfonzoc',
  host: 'localhost',
  database: 'health_net',
  password: '', // pon tu password si tienes
  port: 5432,
});

pool.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch(err => console.error('❌ Error conexión BD:', err));

module.exports = pool;