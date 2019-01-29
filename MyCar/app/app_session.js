var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

app.use(bodyParser.urlencoded({ extended: false}));

app.use(session({
  secret: '213FDIJE@##$!Aasdf',
  resave: false,
  saveUninitialized: true
}));

app.get('/count', function(req, res) {
  if (req.session.count) {
    req.session.count++;
  }else{
    req.session.count = 1;
  }

  res.send('count : '+req.session.count);
});

app.post('/auth/login', function(req, res) {
  res.send(req.body.username);
});

app.get('/auth/login', function(req, res) {
  var output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post">
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
  res.send(output);
});

app.get('/temp', function(req, res) {
  res.send('result : '+ req.session.count);
});

app.listen(3000, function() {
  console.log('Connected 3000 port!!');
});
