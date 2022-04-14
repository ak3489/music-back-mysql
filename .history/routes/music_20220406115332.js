var express = require('express');
var router = express.Router();

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
  queueLimit: 0
});

router.get('/', function(req, res, next) {

    pool.getConnection((err, conn)=> {
        const sql = "select * from singer";//查询jd_user表中的用户
        conn.query(sql, async(err, result)=>{
            if (err) throw err;
            await res.status(200).send(result)
            console.log('result',result);
            conn.release();//数据查询成功后归还连接
        })
    })

});

module.exports = router;
