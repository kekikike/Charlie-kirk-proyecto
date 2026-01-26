const http = require('http');

function makeRequest(method, path, body, callback) {
  const data = JSON.stringify(body);
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: path,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };
  
  const req = http.request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => responseBody += chunk);
    res.on('end', () => {
      try {
        callback(null, JSON.parse(responseBody), res.statusCode);
      } catch(e) {
        callback(e, null, res.statusCode);
      }
    });
  });
  
  req.on('error', callback);
  if (body) req.write(data);
  req.end();
}

console.log('\n=== PRUEBAS DE SEGURIDAD ZERO TRUST ===\n');

// Test 1: Login exitoso
console.log('1. Test Login Exitoso (Admin)');
makeRequest('POST', '/api/auth/login', 
  {correo: 'willibarb2502@gmail.com', contraseña: 'Test1234'}, 
  (err, result, status) => {
    if (err) {
      console.log('   ❌ Error:', err.message);
    } else if (result.token) {
      console.log('   ✅ Login exitoso - Token JWT obtenido');
      console.log('   Token:', result.token.substring(0, 30) + '...');
      
      // Test 2: Login fallido con contraseña incorrecta
      console.log('\n2. Test Login Fallido (Contraseña Incorrecta)');
      makeRequest('POST', '/api/auth/login',
        {correo: 'willibarb2502@gmail.com', contraseña: 'WrongPassword'},
        (err, result, status) => {
          if (result.mensaje) {
            console.log('   ✅ Rechazado correctamente:', result.mensaje);
          } else {
            console.log('   ❌ Debería haber rechazado');
          }
          
          // Test 3: Login con usuario vendedor
          console.log('\n3. Test Login Vendedor');
          makeRequest('POST', '/api/auth/login',
            {correo: 'favio@gmail.com', contraseña: 'Admin123'},
            (err, result, status) => {
              if (result.token) {
                console.log('   ✅ Vendedor logrado con token JWT');
                const vendedorToken = result.token;
                
                // Test 4: Acceder recurso sin token
                console.log('\n4. Test Acceso sin Token');
                makeRequest('GET', '/api/productos', null, (err, result, status) => {
                  if (status !== 200) {
                    console.log('   ✅ Acceso rechazado (Status:', status + ')');
                  } else {
                    console.log('   ⚠️  Acceso permitido sin token');
                  }
                  
                  console.log('\n=== PRUEBAS COMPLETADAS ===\n');
                  process.exit(0);
                });
              } else {
                console.log('   ❌ Error en login de vendedor:', result.mensaje);
                process.exit(0);
              }
            });
        });
    } else {
      console.log('   ❌ Error:', result.mensaje);
      process.exit(0);
    }
});
