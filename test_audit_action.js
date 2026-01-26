require('dotenv').config();
const http = require('http');

// Primero hacer login para obtener token
const loginData = JSON.stringify({correo: 'willibarb2502@gmail.com', contraseña: '1234'});
const loginOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
};

const loginReq = http.request(loginOptions, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    const result = JSON.parse(body);
    
    if (result.token) {
      console.log('✅ Login exitoso');
      const token = result.token;
      
      // Ahora crear un producto
      const productData = JSON.stringify({
        nombre: 'Producto Test ' + Date.now(),
        idcategoria: 1,
        preciounitario: 99.99,
        descripcion: 'Producto para probar auditoría'
      });
      
      const productOptions = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/productos',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
          'Content-Length': Buffer.byteLength(productData)
        }
      };
      
      const productReq = http.request(productOptions, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          const result = JSON.parse(body);
          console.log('\n📦 Crear Producto:');
          if (result.codproducto) {
            console.log('✅ Producto creado exitosamente (ID:', result.codproducto + ')');
          } else {
            console.log('Response:', result);
          }
          
          // Esperar 2 segundos y verificar auditoría
          setTimeout(() => {
            const db = require('./recursos/config/conexion.js');
            db.query('SELECT COUNT(*) as total FROM tauditlogs', (err, results) => {
              if (err) {
                console.log('\n❌ Error consultando auditoría:', err.message);
              } else {
                console.log('\n📊 Registros en auditoría:', results[0].total);
                if (results[0].total > 0) {
                  db.query('SELECT * FROM tauditlogs ORDER BY fechaaccion DESC LIMIT 1', (err, logs) => {
                    const log = logs[0];
                    console.log('\n✅ ÚLTIMA ACCIÓN REGISTRADA:');
                    console.log('   - Tabla:', log.tabla);
                    console.log('   - Acción:', log.accion);
                    console.log('   - Usuario:', log.ciempleado);
                    console.log('   - Resultado:', log.resultado);
                    console.log('   - IP:', log.ip_address);
                    console.log('   - Hora:', log.fechaaccion);
                  });
                }
              }
              db.end();
            });
          }, 2000);
        });
      });
      
      productReq.on('error', (e) => console.error('Error:', e));
      productReq.write(productData);
      productReq.end();
    } else {
      console.log('❌ Login falló:', result.mensaje);
    }
  });
});

loginReq.on('error', (e) => console.error('Error:', e));
loginReq.write(loginData);
loginReq.end();
