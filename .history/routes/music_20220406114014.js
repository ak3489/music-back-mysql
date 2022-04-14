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

// // 查询实例
// db.query('select * from t_user', [],function(result,fields){
//     console.log('查询结果：');
//     console.log(result);
// });
// //添加实例
// var  addSql = 'INSERT INTO websites(username,password) VALUES(?,?)';
// var  addSqlParams =['咕噜先森', '666'];
// db.query(addSql,addSqlParams,function(result,fields){
//     console.log('添加成功')
// })

/* GET users listing. */
router.get('/', function(req, res, next) {
    // db.query('select * from singer', [],function(result,fields){
    //     console.log('查询结果：');
    //     console.log(result);
    // });
   
    pool.query('select * from singer', function(err, rows, fields) {
        console.log('rows',rows);
        console.log('fields',fields);
        // Connection is automatically released when query resolves
        res.status(200).send(rows)
        // res.send('respond with a resource',rows);
     })
    // res.send('respond with a resource',result);
});
  

// router.post('/addMusic', function (req, res, next) {
//     const musicName = req.body.musicName;
//     const createDate = Date.now();

//     var music = new Music({
//         musicName: musicName,
//         createDate: createDate
//     });
//     console.log(`Adding a new music ${musicName} - createDate ${createDate}`)

//     music.save()
//         .then(() => {
//             console.log(`Added new music ${musicName} - createDate ${createDate}`)
//             res.redirect('/');
//         })
//         .catch((err) => {
//             console.log(err);
//             res.send('Sorry! Something went wrong.');
//         });
// });

module.exports = router;
