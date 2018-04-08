const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//const logger = require('morgan');
require('./lib/db');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const indexRouter = require('./routes/index');
const codeRouter = require('./routes/code2');
const robotRouter = require('./routes/robot');
const infoRouter = require('./routes/playerinfo');
const applyRouter = require('./routes/apply');
// 后台管理路由
const userRouter = require('./routes/admin/user');
const playerRouter = require('./routes/admin/player');
const reviewRouter = require('./routes/admin/review');
const wxRouter = require('./routes/weixin/wxshare');

const ruleRouter = require('./routes/admin/rule');

const taskRouter = require('./routes/admin/task');

const app = express();


// 日志log4js
const log4js = require('log4js');
var log = log4js.getLogger("app");
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// 配置session
const identityKey = "can";
app.use(session({
  name: identityKey,
  secret: 'youlan',
  store: new FileStore(),
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 50 * 60 * 1000 //单位时ms
  }
}));

//设置跨域访问
app.all('*', function(req, res, next) {  
  //res.header("Access-Control-Allow-Origin", "*");  
  //res.header("Access-Control-Allow-Headers", "Content-Type,Access-Token");  
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
  res.header("X-Powered-By",' 3.2.1');
  //res.header("Content-Type", "application/json;charset=utf-8");  
  next();  
});

//设置后台登录验证中间件
// app.use(/^(\/admin)/, function(req, res ,next){
//   if(req.session.username && req.session.password){
//     next();
//   }else {
//     res.json({code: 202, msg: "请先登录"});
//   }
// });

app.use('/', indexRouter);
app.use('/code', codeRouter);
app.use('/robot', robotRouter);
app.use('/info', infoRouter);
app.use('/apply', applyRouter);
// admin
app.use('/user', userRouter);
app.use('/admin/player', playerRouter);
app.use('/admin/review', reviewRouter);
app.use('/weixin', wxRouter);
app.use('/rule', ruleRouter);
app.use('/task', taskRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  log.error("Something went wrong:", 404);
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  log.error("Something went wrong:", err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
