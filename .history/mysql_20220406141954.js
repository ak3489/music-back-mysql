const mysql = require('mysql2');//引入mysql模块

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

