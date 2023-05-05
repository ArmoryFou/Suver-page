var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config({path: "./env/.env"});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var demonlistRouter = require('./routes/demonlist');
const { fs } = require('fs');




var app = express();

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
const bcryptjs = require("bcryptjs");

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

const session = require("express-session");
app.use(session({
  secret: "Suver1234Crisvigo",
  resave: true,
  saveUninitialized: true
}));

const connection = require("./database/db.js");
const bcrypt = require('bcryptjs/dist/bcrypt');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/demonlist', demonlistRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the 404 page if the status code is 404
  if (err.status === 404) {
    res.status(404);
    res.render('404');
  } else {
    // render the error page for other types of errors
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;
