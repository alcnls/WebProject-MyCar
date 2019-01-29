var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}))

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/about', function(req, res) {
  res.render('about');
});

app.get('/board', function(req, res) {
  res.render('board');
});




app.listen(3000, function() {
  console.log('Connected 3000 port');
});
