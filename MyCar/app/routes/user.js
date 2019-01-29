module.exports = function(passport) {
  var express = require('express');
  var bkfd2Password = require('pbkdf2-password');
  var hasher = bkfd2Password();
  var conn = require('./../config/mysql/db')();
  var route = express.Router();



  // route.post(
  //   '/login',
  //   passport.authenticate(
  //     'local',
  //     {
  //       //successRedirect: '/',
  //       failureRedirect: '/user/login',
  //       failureFlash: false
  //     }), function(req, res) {
  //       req.session.save(function() {
  //         console.log('로그인');
  //         res.redirect('/main');
  //       });
  //     });

  // route.post(
  //   '/login',
  //   passport.authenticate(
  //     'local',
  //     {
  //       successRedirect: '/main',
  //       failureRedirect: '/user/login',
  //       failureFlash : true
  //     }));


      route.post(
        '/login',
        passport.authenticate(
          'local-login',
          {
            successRedirect: '/main',
            failureRedirect: '/user/login',
            failureFlash : true
          }));

  route.get('/register', function(req, res) {
    res.render('register');
  });

  route.post('/register', function(req, res) {
    hasher({password:req.body.password}, function(err, pass, salt, hash) {
      var user = {
        authId:'local:'+req.body.username,
        name:req.body.name,
        username:req.body.username,
        password:hash,
        salt:salt
      };

      var sql = 'INSERT INTO users SET ?';
      conn.query(sql, user, function(err, result, fields) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }else{
          req.login(user, function(err) {
            req.session.save(function() {
              res.redirect('/main');
            });
          });
        }
      });
    });
  });

  route.get('/edit/:id', function(req, res) {

    var id = req.params.id;

    var sql = 'select * from users where id = ?';
    conn.query(sql, [id], function(err, result) {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }else{
        res.render('user_edit',{result:result[0]});
      }
    });
  });

  route.post('/edit/:id', function(req, res) {

    var id = req.params.id;
    var name = req.body.name;

    var sql = 'update users set name=? where id =?';
    conn.query(sql, [name, id], function(err, result) {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }else{
        res.redirect('/main');
      }
    });
  });


  route.get('/login', function(req, res) {
    //req.flash('message','asdfasdf');
    res.render('login',{message:req.flash('loginError')});
  });

  route.get('/logout', function(req, res) {
    req.logout();
    req.session.save(function() {
      res.redirect('/main');
    });
  });


  return route;
};
