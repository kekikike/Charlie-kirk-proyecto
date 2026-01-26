require('dotenv').config();
const db = require('./recursos/config/conexion.js');
const newHash = '$2b$10$2wcMy2XjNzXKsmufC8c16.vrZoTklh.2y2zYjIvQBRUhf4tMRzk5e';
db.query('UPDATE templeados SET contraseña = ? WHERE ciempleado = 1', [newHash], (err) => {
  if (err) console.error('Error:', err);
  else {
    db.query('SELECT contraseña FROM templeados WHERE ciempleado = 1', (err2, results) => {
      console.log('Hash stored:', results[0].contraseña);
      db.end();
    });
  }
});
