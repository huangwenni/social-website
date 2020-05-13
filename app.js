const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const loginRouter = require('./routes/controllers/login');
const indexRouter = require('./routes/controllers/index');
const myHomeRouter = require('./routes/controllers/myHome');
const homeRouter = require('./routes/controllers/home');
const friendsRouter = require('./routes/controllers/friends');
const collectionRouter = require('./routes/controllers/collection');
const personalRouter = require('./routes/controllers/personal');
const messageRouter = require('./routes/controllers/message');
const postRouter = require('./routes/controllers/post');

const webRouter = require('./routes/web_router');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html',require('express-art-template'));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret:'Social Website',
    cookie:{maxAge:60*1000*60*24},
    resave:true,
    saveUninitialized:false
}));

app.use('/', webRouter);

// app.use('/', loginRouter);
// app.use('/index', indexRouter);
// app.use('/myHome',myHomeRouter);
// app.use('/home',homeRouter);
// app.use('/friends',friendsRouter);
// app.use('/collection',collectionRouter);
// app.use('/personal',personalRouter);
// app.use('/message',messageRouter);
// app.use('/post',postRouter);


//连接数据库
mongoose.connect('mongodb://localhost:27017/mongoose_project',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected',()=>{
    console.log('数据库连接成功');
});
mongoose.connection.on('error',()=>{
    console.log('数据库连接失败');
});
mongoose.connection.on('disconnected',()=>{
    console.log('数据库连接断开')
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

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
