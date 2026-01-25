const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '252005', 
  database: 'kirkmark'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Conectado a la base de datos Kirkmark');
});

module.exports = connection;