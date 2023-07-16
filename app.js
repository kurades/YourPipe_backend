var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors")
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var musicRouter = require('./routes/music');
var DBConnect = require('./database/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// connect mongo
DBConnect();

// have no idea
// app.use(cors())
var allowCrossDomain = function(req, res, next) {
  // res.header('Access-Control-Allow-Origin', 'https://todone-psi.vercel.app');
  // res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Origin', 'http://172.31.41.141:8080');
  res.header('Access-Control-Allow-Credentials', "true")
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, auth_token");

  next();
}
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(allowCrossDomain)
// Route
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/music',musicRouter);

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
