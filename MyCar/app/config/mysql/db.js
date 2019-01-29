module.exports = function() {
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'roqkf567@',
    database : 'car_db',

  });


  conn.connect();


  return conn;
};
