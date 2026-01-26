# 🔐 Implementación de Zero Trust en KIRKMARK

## Medidas de Seguridad Implementadas

### 1. ✅ Encriptación de Contraseñas (bcrypt)
- **Archivo**: `recursos/servicios/autenticacion.js`
- **Función**: `encriptarContraseña()` y `compararContraseña()`
- **Configuración**: 10 rounds de bcrypt
- **Aplicación**: Todas las contraseñas se hashean antes de guardar

### 2. ✅ Rate Limiting (Protección contra Fuerza Bruta)
- **Archivo**: `recursos/middleware/rateLimiting.js`
- **Configuraciones**:
  - Login: máximo 5 intentos en 15 minutos
  - API General: máximo 100 requests en 15 minutos
  - Operaciones críticas: máximo 30 requests por minuto
- **Por qué**: Previene ataques de fuerza bruta y DoS

### 3. ✅ Validación y Sanitización de Entrada
- **Archivo**: `recursos/middleware/validacion.js`
- **Libería**: express-validator
- **Protecciones**:
  - Validación de email, teléfono, fechas
  - Sanitización de strings (trim, escape)
  - Validación de longitud y formato
  - Validación de arrays y objetos anidados
- **Previene**: SQL injection, XSS, datos inválidos

### 4. ✅ Autorización Granular (Zero Trust)
- **Archivo**: `recursos/middleware/autorizacion.js`
- **Sistema de Permisos**:
  - **Admin (rol 1)**: Acceso total a usuarios, productos, inventario, empleados, auditoría
  - **Vendedor (rol 2)**: Solo lectura de productos/inventario, crear ventas
- **Verificación**: Cada endpoint valida permisos antes de ejecutar

### 5. ✅ Audit Logging (Auditoría Completa)
- **Archivo**: `recursos/servicios/auditlogs.js`
- **Tabla**: `tauditlogs` en BD
- **Registra**:
  - Usuario que ejecutó la acción
  - Tipo de acción (POST, PUT, DELETE)
  - Tabla y registro afectado
  - Datos anteriores y nuevos (JSON)
  - IP y User-Agent del cliente
  - Resultado (exitoso/fallido)
  - Timestamp exacto
- **Acceso**: Solo administrador puede ver logs en `/api/auditlogs`

### 6. ✅ Helmet para Headers de Seguridad
- **Archivo**: `recursos/ruta/app.js`
- **Protecciones**:
  - `X-Content-Type-Options: nosniff` - Previene sniffing de MIME
  - `X-Frame-Options: DENY` - Previene clickjacking
  - `X-XSS-Protection: 1; mode=block` - Protección XSS
  - Content Security Policy
  - HSTS (cuando HTTPS)

### 7. ✅ Secrets Management
- **Archivo**: `.env`
- **Variables Protegidas**:
  - `JWT_SECRET`: Clave para firmar tokens
  - `DB_PASSWORD`: Contraseña de BD
  - `BCRYPT_ROUNDS`: Niveles de encriptación
  - `JWT_EXPIRE`: Duración de tokens
- **Nunca**: Commitear `.env` a git

### 8. ✅ CORS Mejorado
- **Configuración**: Headers de seguridad adicionales
- **Protege**: Contra peticiones cross-origin maliciosas

### 9. ✅ Token JWT con Expiración
- **Duración**: 24 horas (configurable en `.env`)
- **Validación**: En middleware `verificarToken()`
- **Almacenamiento**: En localStorage del navegador (seguro en HTTPS)

## Pendiente para Producción

### 1. HTTPS/TLS (Con Cloudflare)
- Todo tráfico debe ser encriptado
- Configurar certificado SSL
- Redirigir HTTP a HTTPS

### 2. Session Timeout
- Implementar en frontend
- Cerrar sesión si inactivo >30 minutos

### 3. MFA (Autenticación Multifactor)
- SMS, Email o Authenticator app
- Requerido para admin

### 4. Database Encryption
- Encriptar columnas sensibles (contraseñas ya están hasheadas)
- Encriptación en reposo de la BD

### 5. API Gateway
- Rate limiting adicional
- DDoS protection
- IP whitelisting

## Flujo de Seguridad Zero Trust

```
Cliente → HTTPS (Cloudflare) 
       ↓
    Helmet Headers
       ↓
    CORS Validation
       ↓
    Rate Limiting
       ↓
    JWT Verification
       ↓
    Input Validation
       ↓
    Authorization Check (Rol + Permiso)
       ↓
    Execution + Audit Logging
       ↓
    Response (Sanitized)
```

## Cómo Usar

### Registrar Usuario
```bash
POST /api/auth/registro
Headers: Authorization: Bearer {token}
Body: {
  "nombre1": "Juan",
  "apellido1": "Pérez",
  "correo": "juan@example.com",
  "telefono": "71234567",
  "fechanac": "1990-01-01",
  "sexo": 1,
  "contraseña": "Pass123", # Mín 6 chars, mayúscula, minúscula, número
  "rol": 2
}
```

### Login
```bash
POST /api/auth/login
Body: {
  "correo": "admin@example.com",
  "contraseña": "tu_contraseña"
}
Response: {
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": { ... }
}
```

### Consultar Auditoría
```bash
GET /api/auditlogs?ciempleado=1&accion=POST&limite=50
Headers: Authorization: Bearer {admin_token}
```

## Monitoreo Recomendado

1. Revisar logs de auditoría regularmente
2. Alertas para múltiples intentos fallidos
3. Auditoría de cambios en permisos
4. Logs de acceso a datos sensibles
5. Monitoreo de intentos de SQL injection bloqueados

## Referencias de Seguridad

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Zero Trust Architecture](https://www.nist.gov/publications/zero-trust-architecture)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [bcryptjs Security](https://github.com/dcodeIO/bcrypt.js)
