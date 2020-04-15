var createError = require('http-errors');
var express = require('express');
var path = require('path');

var session = require('express-session');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var db = require('./models/db');
global.db = db;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});

app.use(session({
  key: 'username',
  secret: "superduperquadralicious",
  maxAge: 30*60*1000,  // 30 minutes
  resave: false,
  saveUninitialized: false,
  cookie:{
    expires: 600000
  }
}));

app.get('/hello', function(req,res){
  if (req.session.user){
    // for verified user
    res.send(req.session.user);
  } else {
    // redirect ... back to login
  }

});

app.get('/setSession', function(req,res){
  // ... verified user ...
  databaseQueryUser = {name:"bobby", age:38};
  req.session.user = databaseQueryUser;
  // req.session.image = ...;
  res.send(`
    <a href="/hello">LINK</a>`);
});

function generateAccessToken(user){}


module.exports = app;
