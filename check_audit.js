require('dotenv').config();
const db = require('./recursos/config/conexion.js');

db.query('SELECT COUNT(*) as total FROM tauditlogs', (err, results) => {
  if (err) {
    console.log('❌ Tabla tauditlogs no existe o hay error');
    console.log('Error:', err.message);
  } else {
    console.log('📊 Registros actuales en tauditlogs:', results[0].total);
    if (results[0].total > 0) {
      db.query('SELECT * FROM tauditlogs ORDER BY fechaaccion DESC LIMIT 3', (err, logs) => {
        console.log('\n📋 Últimas 3 acciones:');
        logs.forEach((log, i) => {
          console.log(`\n  Acción ${i+1}:`);
          console.log('  - Tabla:', log.tabla);
          console.log('  - Acción:', log.accion);
          console.log('  - Resultado:', log.resultado);
          console.log('  - IP:', log.ip_address);
          console.log('  - Usuario:', log.ciempleado);
        });
      });
    } else {
      console.log('\nℹ️  Aún no hay registros. Necesitas hacer una acción (POST/PUT/DELETE)');
    }
  }
  setTimeout(() => db.end(), 1000);
});
