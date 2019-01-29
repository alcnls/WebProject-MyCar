module.exports = function() {

  var express = require('express');
  var flash = require('connect-flash');
  var bodyParser = require('body-parser');
  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session);

  var app = express();

  app.locals.pretty = true;
  app.set('view engine', 'jade');
  app.set('views', './views_shoping');
  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({ extended: false}))
  app.use(flash());
  app.use(session({
    secret: '213FDIJE@##$!Aasdf',
    resave: false,
    saveUninitialized: true,
    store:new MySQLStore({
      host:'localhost',
      port:3306,
      user:'root',
      password:'roqkf567@',
      database:'car_db'
    })
  }));

  return app;
}
