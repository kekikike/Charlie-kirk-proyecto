const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'cc++4kglt',
  database: 'kirkmark'
});

connection.connect(err => {
  if (err) throw err;
  connection.query(
    "SET SESSION sql_mode = (SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))",
    (err) => {
      if (err) throw err;
      console.log('Conectado a la base de datos Kirkmark sin ONLY_FULL_GROUP_BY');
    }
  );
});

module.exports = connection;
