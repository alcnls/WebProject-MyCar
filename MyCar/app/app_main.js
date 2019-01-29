var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();


app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}));

app.use(session({
  secret: '213FDIJE@##$!Aasdf',
  resave: false,
  saveUninitialized: true
}));

app.get('/main', function(req, res) {
  var output = `
    <h1>Login</h1>
    <form action="/test/check" method="post">
      <p>
        <input type="text" name"username" placeholder="username">
      </p>
      <p>
        <input type="password" name="password" placeholder="password">
      </p>
      <p>
        <input type="submit">
      </p>

    </form>
  `;
  res.render('main');
});

app.listen(3000, function() {
  console.log('Connected 3000 port!!');
});
