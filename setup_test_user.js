require('dotenv').config();
const bcrypt = require('bcryptjs');

// Hash a password for testing  
const password = 'Admin123';
bcrypt.hash(password, 10, (err, hash) => {
  if (err) console.error(err);
  console.log('Para usuario favio@gmail.com:');
  console.log('Hash:', hash);
  
  // Update BD
  const db = require('./recursos/config/conexion.js');
  db.query('UPDATE templeados SET contraseña = ? WHERE ciempleado = 2', [hash], (err) => {
    if (err) console.error('DB Error:', err);
    else console.log('✓ Contraseña actualizada para favio');
    db.end();
  });
});
