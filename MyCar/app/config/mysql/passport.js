module.exports = function(app) {
  var conn = require('./db')();
  var bkfd2Password = require('pbkdf2-password');
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var hasher = bkfd2Password();

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    console.log('serializeUser',user);
    done(null, user.authId);
  });

  passport.deserializeUser(function(id, done) {
    console.log('deserializeUser',id);
    var sql = 'select * from users where authId = ?';
    conn.query(sql,[id], function(err, result, fields) {
      if (err) {
        console.log(err);
        return done(null,err);
      }else{
          return done(null, result[0]);
        }
    });
  });

  // passport.use(new LocalStrategy(
  //   function( username, password, done) {
  //     var user_id = username;
  //     var pwd = password;
  //
  //     var sql = 'select * from users where authId = ?';
  //     conn.query(sql, ['local:'+user_id], function(err, result, fields) {
  //       console.log(result);
  //         if (result[0]) {
  //           var user = result[0];
  //           return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash) {
  //             if (hash === user.password) {
  //               console.log("LocalStrategy", user.username);
  //               return done(null, user);
  //               // req.session.name = data_name;
  //               // res.redirect('http://13.125.234.77:3000/');
  //             }else{
  //               console.log('비밀번호 틀림');
  //               return done(null, false ,{message:'비밀번호가 정확하지 않습니다. 정확하게 입력 후 다시 시도하여 주세요.'});
  //               //return done(null, false ,req.falsh('loginError','비밀번호가 정확하지 않습니다. 정확하게 입력 후 다시 시도하여 주세요.'));
  //
  //               // res.render('login',{msg:'비밀번호가 정확하지 않습니다. 정확하게 입력 후 다시 시도하여 주세요.'});
  //             }
  //           });
  //       }else{
  //         console.log('아이디 틀림');
  //         return done(null, false , {message:'아이디가 정확하지 않습니다. 정확하게 입력 후 다시 시도하여 주세요.'});
  //         // res.render('login',{msg:'아이디가 정확하지 않습니다. 정확하게 입력 후 다시 시도하여 주세요.'});
  //       }
  //     });
  //   }
  // ));

  passport.use('local-login',new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },function(req, username, password, done) {
      var user_id = username;
      var pwd = password;

      var sql = 'select * from users where authId = ?';
      conn.query(sql, ['local:'+user_id], function(err, result, fields) {
        console.log(result);
          if (result[0]) {
            var user = result[0];
            return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash) {
              if (hash === user.password) {
                console.log("LocalStrategy", user.username);
                return done(null, user);
                // req.session.name = data_name;
                // res.redirect('http://13.125.234.77:3000/');
              }else{
                console.log('비밀번호 틀림');
                //return done(null, false ,{message:'비밀번호가 정확하지 않습니다. 정확하게 입력 후 다시 시도하여 주세요.'});
                return done(null, false ,req.flash('loginError','비밀번호가 정확하지 않습니다. 정확하게 입력 후 다시 시도하여 주세요.'));

                // res.render('login',{msg:'비밀번호가 정확하지 않습니다. 정확하게 입력 후 다시 시도하여 주세요.'});
              }
            });
        }else{
          console.log('아이디 틀림');
          return done(null, false ,req.flash('loginError','아이디가 정확하지 않습니다. 정확하게 입력 후 다시 시도하여 주세요.'));
          //return done(null, false , {message:'아이디가 정확하지 않습니다. 정확하게 입력 후 다시 시도하여 주세요.'});
          // res.render('login',{msg:'아이디가 정확하지 않습니다. 정확하게 입력 후 다시 시도하여 주세요.'});
        }
      });
    }
  ));

  return passport;
};
