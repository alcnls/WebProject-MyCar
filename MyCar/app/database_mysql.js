var mysql = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'roqkf567@',
  database : 'o2',

});

conn.connect();

// 데이터 검색
// var sql = 'SELECT * FROM topic';
// conn.query(sql, function(err, rows, fields) {
//   if (err) {
//     console.log(err);
//   }else{
//     for (var i = 0; i < rows.length; i++) {
//       console.log(rows[i].title);
//       console.log(rows[i].description);
//       console.log(rows[i].author);
//     }
//   }
// });

// 데이터 추가
// var sql = 'INSERT INTO topic (title, description, author) VALUES(?,?,?)';
// var params = ['Supervisor','Watcher','graphittie'];
// conn.query(sql, params, function(err, rows, fields) {
//   if (err) {
//     console.log(err);
//   }else{
//     console.log(rows.insertId);
//   }
// });

// 데이터 수정
// var sql = 'UPDATE topic SET title=? WHERE id=?';
// var params = ['NPM',2];
// conn.query(sql, params, function(err, rows, fields) {
//   if (err) {
//     console.log(err);
//   }else{
//     console.log(rows);
//   }
// });

// 데이터 삭제
var sql = 'DELETE FROM topic WHERE id=?';
var params = [2];
conn.query(sql, params, function(err, rows, fields) {
  if (err) {
    console.log(err);
  }else{
    console.log(rows);
  }
});



conn.end();
