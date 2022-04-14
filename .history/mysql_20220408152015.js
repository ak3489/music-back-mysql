// get the client
const mysql = require('mysql2');

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'music',
  password : '54332603',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // multipleStatements: true
});

module.exports = pool