const mysql = require('mysql2');//引入mysql模块
// var databaseConfig = require('./mysql.config');  //引入数据库配置模块中的数据
 

//向外暴露方法
module.exports = {
    pool : mysql.createPool({
        host: 'localhost',
        user: 'root',
        database: 'music',
        password : '54332603',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    })
};

// 演示实例
// var db=require('../mysql.js');
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

