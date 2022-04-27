/*
 * @gcz: gcz
 */
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
  // multipleStatements 查询允许多个 mysql 语句。小心这一点，它可能会增加 SQL 注入攻击的范围。(默认: false)
  multipleStatements: true
});

module.exports = pool