/*
 * @Author: your name
 * @Date: 2022-04-06 10:08:27
 * @LastEditTime: 2022-04-27 10:38:57
 * @gcz: gcz
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \music-back-mysql\app.js
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var data = require('./data');

var app = express();

//添加路由
app.use('/music', require('./routes/music'));
app.use('/users', require('./routes/users'));

// var indexRouter = require('./routes/index');
// app.use('/', indexRouter);
// app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
// app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const {format} = require("date-fns")
app.locals.format = format;

app.use(express.static(path.join(__dirname, 'musics')))
app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/"+"index.html");
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log('app.js req', req);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//监听文件变化
// const chokidar = require('chokidar')
// chokidar.watch('./musics/', {
//   persistent: true,
//   ignored: /(^|[\/\\])\../, // 忽略点文件
//   // cwd: '.', // 表示当前目录
//   depth: 10 // 只监听当前目录不包括子目录
// }).on('all', (event, path) => {//监听除了ready, raw, and error之外所有的事件类型
//   console.log(event, path);
// });



module.exports = app;
