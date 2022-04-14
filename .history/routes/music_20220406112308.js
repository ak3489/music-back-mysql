var express = require('express');
var router = express.Router();

var db=require('../mysql.js');
// 查询实例
db.query('select * from t_user', [],function(result,fields){
    console.log('查询结果：');
    console.log(result);
});
//添加实例
var  addSql = 'INSERT INTO websites(username,password) VALUES(?,?)';
var  addSqlParams =['咕噜先森', '666'];
db.query(addSql,addSqlParams,function(result,fields){
    console.log('添加成功')
})

/* GET users listing. */
router.get('/', function(req, res, next) {
    db.query('select * from singer', [],function(result,fields){
        console.log('查询结果：');
        console.log(result);
    });
    res.send('respond with a resource',result);
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
