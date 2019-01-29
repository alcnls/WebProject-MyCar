var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // if (파일의 형식이 이미지면) {
    //   cb(null, 'uploads/images');
    // }else if (파일의 형식이 텍스트면) {
    //   cb(null, 'uploads/texts');
    // }
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // if (이미 파일이 존재한다면) {
    //   cb(null, file.originalname );// 동일 이름의 파일 중에 가장 큰 숫자를 끝에 붙인다
    // }else{
    //   cb(null, file.originalname );
    // }
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: _storage });
var fs = require('fs');

var mysql = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'roqkf567@',
  database : 'o2',

});

conn.connect();

var app = express();

// bodyParser 사용
app.use(bodyParser.urlencoded({ extended: false}));
app.locals.pretty = true;

app.use('/user', express.static('uploads'));

app.set('view engine', 'jade');
app.set('views','./views_mysql');

app.get('/upload', function(req, res) {
  res.render('upload');
});

app.post('/upload', upload.single('userfile'), function(req, res) {
  console.log(req.file);
  res.send('Uploaded : '+req.file.filename );
});

// 데이터 추가
app.get('/topic/add', function(req, res) {
  var sql = 'SELECT id,title FROM topic';
  conn.query(sql, function(err, topics, fields) {
    if (err) {
       console.log(err);
       res.status(500).send('Internal Server Error');
     }
    res.render('add', {topics:topics});
  });


  // 파일 읽어오기
  // fs.readdir('data', function(err, files) {
  //   if (err) {
  //     console.log(err);
  //     res.status(500).send('Internal Server Error');
  //   }
  //   res.render('add', {topics:files});
  // });



});


app.post('/topic/add', function(req, res) {
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  //fs.writeFile('data/'+title, description, function(err) {
  //});

  var sql = 'INSERT INTO topic (title,description,author) VALUES(?,?,?)';
  conn.query(sql,[title,description,author], function(err, result, fields) {
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.redirect('/topic/'+result.insertId);
      console.log(result);
    }
  });
});

app.listen(3000, function() {
  console.log('Connected, 3000 port!');
});


app.get(['/topic/:id/edit'], function(req, res) {
  var sql = 'SELECT id,title FROM topic';
  conn.query(sql, function(err, topics, fields) {
    var id = req.params.id;
    if (id) {
      var sql = 'SELECT * FROM topic WHERE id=?';
      conn.query(sql, [id], function(err, topic, fields) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }else{
          res.render('edit' , {topics:topics, topic:topic[0]});
        }
      });
    }else{
      console.log('There is no id.');
      res.status(500).send('Internal Server Error');
    }
  });
});

app.post(['/topic/:id/edit'], function(req, res) {
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var id = req.params.id;
  var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
  conn.query(sql, [title, description, author, id], function(err, result, fields) {
    if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }else{
        res.redirect('/topic/'+id);
      }
    });
  });

app.get(['/topic/:id/delete'], function(req, res) {
  var sql = 'SELECT id,title FROM topic';
  var id = req.params.id;
  conn.query(sql, function(err, topics, fields) {
    var sql = 'SELECT * FROM topic WHERE id=?';
    conn.query(sql, [id], function(err, topic) {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }else{
        if (topic.length === 0) {
          console.log('There is no id.');
          res.status(500).send('Internal Server Error');
        }else{
          //console.log(topic);
          res.render('delete', {topics:topics , topic:topic[0]});
        }
      }
    });
  });
});

app.post(['/topic/:id/delete'], function(req, res) {
  var id = req.params.id;
  var sql = 'DELETE FROM topic WHERE id=?';
  conn.query(sql, [id], function(err, result) {
    res.redirect('/topic');
  });
});

app.get(['/topic','/topic/:id'], function(req, res) {
  var sql = 'SELECT id,title FROM topic';
  conn.query(sql, function(err, topics, fields) {
    var id = req.params.id;
    if (id) {
      var sql = 'SELECT * FROM topic WHERE id=?';
      conn.query(sql, [id], function(err, topic, fields) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }else{
          res.render('view' , {topics:topics, topic:topic[0]});
        }
      });
    }else{
      res.render('view' , {topics:topics});
    }
  });
  /*
  fs.readdir('data', function(err, files) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    var id = req.params.id;
    if (id) {
      // id값이 있을 때
      fs.readFile('data/'+id, 'utf8', function(err, data) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        res.render('view' , {topics:files, title:id , description:data});
      });
    }else{
      // id값이 없을 때
      res.render('view', {topics:files, title:'Welcome', description:'Hello, JavaScript for server.'});
    }
  });
  */
});

// app.get('/topic/:id', function(req, res) {
//   var id = req.params.id;
//   fs.readdir('data', function(err, files) {
//     if (err) {
//       console.log(err);
//       res.status(500).send('Internal Server Error');
//     }
//     fs.readFile('data/'+id, 'utf8', function(err, data) {
//       if (err) {
//         console.log(err);
//         res.status(500).send('Internal Server Error');
//       }
//       res.render('view' , {topics:files, title:id , description:data});
//     });
//   });
// });
