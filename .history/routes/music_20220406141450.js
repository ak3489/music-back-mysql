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

router.post("/addSinger",(req, res)=>{
    const {name, sex, des} = req.body;//获取用户提交的数据
    if(name){
        pool.getConnection((err, conn)=>{
            if(err) throw err;
            const sql = "insert into singer values(null,?,?,?,?)";//写追加数据的sql变量可用"?"占位，追加的字段数量要与刚才查询的字段数量一致，否则会报错 now()
            conn.query(sql,[name, sex, birthday, des],async(error,result)=>{//数组中放我们传入的变量会自动替换"?"
                if(error) throw error;
                await res.status(200).send("添加成功")
                conn.release();
            })
        })
    }
})

module.exports = router;
