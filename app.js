var express = require('express');
//NEW FOR HANDLEBARS
var exphbs = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//DB Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/isobar-node');

var routes = require('./routes/index');
var users = require('./routes/users');
var products = require('./routes/products');
var categories = require('./routes/categories');

var app = express();

//var hbs = exphbs.create({
//	defaultLayout: 'main',
//	helpers: {
//		title: function() { return 'This App'; }
//	}
//});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
// NEW FOR HANDLEBARS
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
app.set('view cache', false);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/products', products);
app.use('/categories', categories);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;