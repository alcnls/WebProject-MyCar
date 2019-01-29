var app = require('./config/mysql/express')();
var conn = require('./config/mysql/db')();
var passport = require('./config/mysql/passport')(app);

app.get('/', function(req, res) {
  res.redirect('/main');
});

// app.get(['/main','/main/:brand','/main/:brand/:size' ], function(req, res) {
//
//   var brand = req.params.brand;
//   var size = req.params.size;
//
//
//   if (brand&&!size) {
//     console.log('brand','들어옴');
//     var sql = 'SELECT * FROM cars WHERE brand = ?';
//
//     conn.query(sql, [brand], function(err, result , fields) {
//       if (err) {
//          console.log(err);
//          res.status(500).send('Internal Server Error');
//        }else{
//          if (req.user && req.user.name) {
//            res.render('main', {result:result ,user:req.user , brand:brand});
//          }else{
//            res.render('main', {result:result , brand:brand});
//          }
//        }
//     });
//   }else if(brand&&size){
//
//     var sql = 'SELECT * FROM cars WHERE brand = ? AND class = ?';
//
//     conn.query(sql, [brand,size], function(err, result , fields) {
//       if (err) {
//          console.log(err);
//          res.status(500).send('Internal Server Error');
//        }else{
//          if (req.user && req.user.name) {
//            if (!result[0]) {
//              console.log("result=false, login=true", result[0]);
//              res.render('main', {result:result[0] ,user:req.user , brand:brand});
//            }else{
//              console.log("result=true, login=true", result);
//              res.render('main', {result:result ,user:req.user , brand:brand});
//            }
//          }else{
//            if (!result[0]) {
//              console.log("result=false, login=false", result[0]);
//              res.render('main', {result:result[0] , brand:brand});
//            }else{
//              console.log("result=true, login=false", result);
//              res.render('main', {result:result , brand:brand});
//            }
//          }
//        }
//     });
//
//   }else{
//     var sql = 'SELECT * FROM cars';
//
//     conn.query(sql, function(err, result , fields) {
//       if (err) {
//          console.log(err);
//          res.status(500).send('Internal Server Error');
//        }else{
//          if (req.user && req.user.name) {
//            res.render('main', {result:result ,user:req.user});
//          }else{
//            res.render('main', {result:result});
//          }
//
//        }
//     });
//   }
// });


app.get(['/main','/main/:brand','/main/:brand/:size' ], function(req, res) {

  var brand = req.params.brand;
  var size = req.params.size;


  if (brand&&!size) {
    console.log('brand','들어옴');
    var sql = 'SELECT * FROM cars WHERE brand = ?';

    conn.query(sql, [brand], function(err, result , fields) {
      if (err) {
         console.log(err);
         res.status(500).send('Internal Server Error');
       }else{
         if (req.user && req.user.name) {
           res.render('main', {result:result ,user:req.user , brand:brand});
         }else{
           res.render('main', {result:result , brand:brand});
         }
       }
    });
  }else if(brand&&size){

    var sql = 'SELECT * FROM cars WHERE brand = ? AND class = ?';

    conn.query(sql, [brand,size], function(err, result , fields) {
      if (err) {
         console.log(err);
         res.status(500).send('Internal Server Error');
       }else{
         if (req.user && req.user.name) {
           if (!result[0]) {
             console.log("result=false, login=true", result[0]);
             res.render('main', {result:result[0] ,user:req.user , brand:brand});
           }else{
             console.log("result=true, login=true", result);
             res.render('main', {result:result ,user:req.user , brand:brand});
           }
         }else{
           if (!result[0]) {
             console.log("result=false, login=false", result[0]);
             res.render('main', {result:result[0] , brand:brand});
           }else{
             console.log("result=true, login=false", result);
             res.render('main', {result:result , brand:brand});
           }
         }
       }
    });

  }else{
    var sql = 'SELECT * FROM cars';

    conn.query(sql, function(err, result , fields) {
      if (err) {
         console.log(err);
         res.status(500).send('Internal Server Error');
       }else{
         if (req.user && req.user.name) {
           res.render('main', {result:result ,user:req.user});
         }else{
           res.render('main', {result:result});
         }

       }
    });
  }
});

app.get('/search', function (req, res) {
  var searchtext = req.query.name;
  var sql = 'SELECT * FROM cars where name like '+'"'+'%'+searchtext+'%'+'"';
  conn.query(sql, function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      if (req.user && req.user.name) {
        res.render('main', {result:result ,user:req.user});
      }else{
        res.render('main', {result:result});
      }
    }
  });

});


app.get('/car/add', function(req, res) {
  if (req.user && req.user.name) {
    res.render('car_add', {user:req.user});
  }else{
    res.render('car_add');
  }

});

app.post('/car/add', function(req, res) {
  var cars = {
    car_type:req.body.type,
    car_brand:req.body.brand,
    car_class:req.body.size,
    car_cc:req.body.cc,
    car_model:req.body.model,
    car_name:req.body.name,
    car_price:req.body.price,
    car_output:req.body.output,
    car_mileage:req.body.mileage,
    car_img:req.body.img
  };

  var sql = 'insert into cars set ?';

  conn.query(sql, cars, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.redirect('/main');
    }
  });
});


app.get('/car/update/:id', function(req, res) {
  var id = req.params.id;

  var sql = 'select * from cars where _id = ?';
  conn.query(sql, [id], function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.render('car_update' , {result:result[0], user:req.user});
    }
  });
});

app.post('/car/update/:id', function(req, res) {

  var id = req.params.id;

  var car = {
    type:req.body.type,
    brand:req.body.brand,
    class:req.body.size,
    cc:req.body.cc,
    model:req.body.model,
    name:req.body.name,
    lowprice:req.body.lowprice,
    highprice:req.body.highprice,
    output:req.body.output,
    mileage:req.body.mileage,
    img:req.body.img
  };
//'update board set subject=?, content=? where id =?';
  var sql = 'update cars set type=?,brand=?,class=?,cc=?,model=?,name=?,lowprice=?,highprice=?,output=?,mileage=?,img=? where _id = ?';
  conn.query(sql, [car.type,car.brand,car.class,car.cc,car.model,car.name,car.lowprice,car.highprice,car.output,car.mileage,car.img,id], function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      console.log(result);
      res.redirect('/main');
    }
  });
});


app.get('/cart', function(req, res) {

  var allPrice = [];
  var price = 0;
  var count = 0;

  console.log('userId', req.user.username);

  if (req.user) {
    var sql = 'SELECT cart.id, cart.userId, cart.count, cars.name, cars.lowprice, cars.highprice ,cart.price FROM cart JOIN cars ON cart.carId = cars._id where userId=?';
    conn.query(sql, [req.user.username], function(err, result) {
      console.log(result);
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }else{

        for (var i = 0; i < result.length; i++) {
          if (result[i].price == 'lowprice') {
            allPrice[i] = result[i].lowprice * result[i].count;
            price = parseInt(price) + parseInt(result[i].lowprice);
            count = parseInt(count) + parseInt(result[i].count);
          }else{
            allPrice[i] = result[i].highprice * result[i].count;
            price = parseInt(price) + parseInt(result[i].highprice);
            count = parseInt(count) + parseInt(result[i].count);
          }

        }
        console.log('result.count',result);
        if (!result[0]) {
          res.render('cart',{result:result[0] , user:req.user, price:price, count:count});
        }else{
          res.render('cart',{result:result , user:req.user, price:price, count:count});
        }

      }
    });
  }else{
    var result = {
      result:'로그인을 먼저 해주세요!'
    };
    res.render('cart',{result:result});
  }

});





app.post('/cart', function(req, res) {

  var car_id = req.body.id;
  var price = req.body.price;

  console.log(price);

  if (req.user) {
    var sql = 'select * from cars where _id = ?';
    conn.query(sql,[car_id], function(err, cars_result) {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }else{

        var cart = {
          userId:req.user.username,
          carId:cars_result[0]._id,
          count:1,
          price:price
        };

        console.log(cart);

        var sql = 'select * from cart where userId=? and carId=? and price=?';
        conn.query(sql, [cart.userId, cart.carId, price], function(err, result) {
          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
          }else{

            if (result[0]) {
              // 상품이 이미 장바구니에 있으면
              var count = parseInt(result[0].count);
              count++;
              // insert 가 이니고 update 해야 함
              var sql = 'update cart set count=? where id=?';
              conn.query(sql,[count,result[0].id],function(err, result) {
                if (err) {
                  console.log(err);
                  res.status(500).send('Internal Server Error');
                }else{
                  res.json({'result':'true', 'msg':'상품을 장바구니에 담았습니다!'});
                }
              });
            }else{
              // 상품이 장바구니에 없으면
              var sql = 'insert into cart set ?';
              conn.query(sql,cart,function(err, result) {
                if (err) {
                  console.log(err);
                  res.status(500).send('Internal Server Error');
                }else{
                  res.json({'result':'true', 'msg':'상품을 장바구니에 담았습니다!'});
                }
              });
            }
          }
        });
      }
    });
  }else{
    res.json({'result':'false','msg':'로그인 후 이용이 가능합니다!'});
  }
});



app.get('/about', function(req, res) {
  if (req.user && req.user.name) {
    res.render('about', {user:req.user});
  }else{
    res.render('about');
  }

});

app.get('/board', function(req, res) {
  var sql = 'select * from board ORDER BY reg_date DESC';

  conn.query(sql, function(err, result, fields) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{

      if (req.user && req.user.username) {
        console.log(result);
        res.render('board', {result:result, user:req.user});
      }else{
        console.log(result);
        res.render('board', {result:result});
      }
    }
  });

});


app.get('/board/add', function(req, res) {
  res.render('board_add',{user:req.user});
});

app.post('/board/add', function(req, res) {
  var board = {
    subject:req.body.subject,
    content:req.body.content,
    user_id:req.user.username,
    password:req.user.password,
    hit:0
  };

  var sql = 'insert into board set ?';
  conn.query(sql, board, function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.redirect('/board');
    }
  });

});


app.get('/board/:id', function(req, res) {

  var id = req.params.id;
  console.log(id);
  if (id) {

    var sql = 'SELECT * FROM board WHERE id = ?';
    conn.query(sql, [id], function(err, result) {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }else{

        var count = result[0].hit;
        count++;

        var sql = 'UPDATE board set hit=? where id=?';

        conn.query(sql, [count, id], function(err, result) {
          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
          }else{
            console.log('조회수 성공');
            var sql = 'SELECT * FROM board WHERE id = ?';
            conn.query(sql, [id], function(err, result) {
              if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
              }else{
                if (req.user && req.user.username) {
                  res.render('board_detail', {board:result[0], user:req.user});
                }else{
                  res.render('board_detail', {board:result[0]});
                }

              }
            });
          }
        });

      }
    });
  }
});

app.get('/board/delete/:id', function(req, res) {

  var id = req.params.id;
  var sql = 'delete from board where id = ?';
  conn.query(sql, [id], function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.redirect('/board');
    }
  });
});

app.get('/board/update/:id', function(req, res) {

  var id = req.params.id;

  var sql = 'select * from board where id = ?';
  conn.query(sql, [id], function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.render('board_modify', {result:result[0]});
    }
  });
});

app.post('/board/update/:id', function(req, res) {
  var id = req.params.id;
  var subject = req.body.subject;
  var content = req.body.content;

  var sql = 'update board set subject=?, content=? where id =?';

  conn.query(sql, [subject, content, id], function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      console.log(result);
      res.redirect('/board/'+id);
    }
  });

});



app.get('/detail/:id', function(req, res) {
  var id = req.params.id;
  console.log(id);
  if (id) {
    var sql = 'SELECT * FROM cars WHERE _id=?';
    conn.query(sql, [id], function(err, result, fields) {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }else{

        var sql = 'SELECT * FROM cars WHERE class = ? AND _id != ?';
        conn.query(sql, [result[0].class, result[0]._id], function(err, result_class) {
          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
          }else{
            if (req.user && req.user.name) {
              res.render('car_detail',{cars:result[0] ,cars_class:result_class, user:req.user});
            }else{
              console.log(result);
              res.render('car_detail',{cars:result[0],cars_class:result_class});
            }
          }
        });
      }
    });
  }else{
    console.log('There is no id.');
    res.status(500).send('Internal Server Error');
  }
});



var user = require('./routes/user')(passport);
app.use('/user/', user);


app.post('/user/check', function(req, res) {
  var username = req.body.username;

  var sql = 'select * from users where username = ?';
  conn.query(sql, [username], function(err, result, fields) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      console.log(result);

      var db_user_id;

      if (result[0]) {
        console.log('데이터있음');
        db_user_id = result[0].username;
      }else{
        console.log('데이터없음');
        db_user_id = "";
      }

      if (db_user_id === username) {
        res.json({'result':'false','msg':'아이디 중복 입니다!'});
      }else if(db_user_id == "" || db_user_id == null || db_user_id == 'undefined'){
        res.json({'result':'true','msg':'아이디 사용 가능 합니다!'});
      }
    }
  });
});


app.listen(3000, function() {
  console.log('Connected 3000 port');
});
