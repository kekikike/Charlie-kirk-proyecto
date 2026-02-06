const crypto = require('crypto');
const db = require('../config/conexion.js');
const { encriptarDato, desencriptarDato, ocultarDato } = require('./encriptacion.js');

/* =========================
   CONFIG CIFRADO
   ========================= */

const ALGORITHM = 'aes-256-cbc';
const KEY = crypto
    .createHash('sha256')
    .update(process.env.SECRET_KEY || 'clave_secreta_no_seas_favio')
    .digest();

/* =========================
   CIFRAR
   ========================= */

function cifrar(texto) {
    if (!texto) return texto;

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(texto, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
}

/* =========================
   DESCIFRAR CON FALLBACK
   ========================= */

function descifrar(texto) {
    try {
        if (!texto || typeof texto !== 'string') return texto;
        if (!texto.includes(':')) return texto; // texto plano viejo

        const [ivHex, encryptedText] = texto.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);

        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        // si falla, asumimos texto plano
        return texto;
    }
}

/* =========================
   CREAR CLIENTE
   ========================= */

const crearCliente = (datos, callback) => {
    const { ci_nit, nombre, apellido, correo, telefono, usuarioA } = datos;

    // Encriptar datos sensibles
    const telefono_enc = telefono ? encriptarDato(telefono) : null;

    const query = `
        INSERT INTO tclientes (ci_nit, nombre, apellido, correo, telefono_enc, estado, usuarioA)
        VALUES (?, ?, ?, ?, ?, 1, ?)
    `;

    db.query(
        query,
        [
            ci_nit,
            cifrar(nombre),
            cifrar(apellido),
            cifrar(correo),
            telefono_enc,
            usuarioA
        ],
        (err, result) => {
            if (err) {
                console.error('[CLIENTES] Error al insertar:', err.message);
                return callback(err, null);
            }

            // Retornar los datos del cliente creado
            callback(null, {
                ci_nit,
                nombre,
                apellido,
                correo,
                telefono: telefono || null,
                estado: 1
            });
        }
    );
};

/* =========================
   OBTENER CLIENTES
   ========================= */

const obtenerClientes = (callback) => {
    const query = `
        SELECT 
            ci_nit,
            nombre,
            apellido,
            correo,
            telefono_enc,
            fecharegistro,
            estado
        FROM tclientes
        WHERE estado = 1
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('[CLIENTES] Error al obtener:', err.message);
            return callback(err, null);
        }

        const clientes = results.map(c => ({
            ci_nit: c.ci_nit,
            nombre: descifrar(c.nombre),
            apellido: descifrar(c.apellido),
            correo: descifrar(c.correo),
            telefono: c.telefono_enc ? desencriptarDato(c.telefono_enc) : null,
            fecharegistro: c.fecharegistro,
            estado: c.estado
        }));

        callback(null, clientes);
    });
};

/* =========================
   OBTENER CLIENTE POR CI
   ========================= */

const obtenerClientePorId = (ci_nit, callback) => {
    const query = `
        SELECT 
            ci_nit,
            nombre,
            apellido,
            correo,
            telefono_enc,
            fecharegistro,
            estado
        FROM tclientes
        WHERE ci_nit = ? AND estado = 1
    `;

    db.query(query, [ci_nit], (err, results) => {
        if (err) {
            console.error('[CLIENTES] Error al obtener por ID:', err.message);
            return callback(err, null);
        }

        if (!results.length) {
            return callback(null, null);
        }

        const c = results[0];
        const clienteDesencriptado = {
            ci_nit: c.ci_nit,
            nombre: descifrar(c.nombre),
            apellido: descifrar(c.apellido),
            correo: descifrar(c.correo),
            telefono: c.telefono_enc ? desencriptarDato(c.telefono_enc) : null,
            fecharegistro: c.fecharegistro,
            estado: c.estado
        };

        callback(null, clienteDesencriptado);
    });
};

/* =========================
   ACTUALIZAR CLIENTE
   ========================= */

const actualizarCliente = (ci_nit, datos, callback) => {
    const campos = [];
    const valores = [];

    if (datos.nombre) {
        campos.push('nombre = ?');
        valores.push(cifrar(datos.nombre));
    }

    if (datos.apellido) {
        campos.push('apellido = ?');
        valores.push(cifrar(datos.apellido));
    }

    if (datos.correo) {
        campos.push('correo = ?');
        valores.push(cifrar(datos.correo));
    }

    if (datos.telefono) {
        campos.push('telefono_enc = ?');
        valores.push(encriptarDato(datos.telefono));
    }

    if (!campos.length) {
        return callback(new Error('Nada para actualizar'), null);
    }

    valores.push(ci_nit);

    const query = `
        UPDATE tclientes
        SET ${campos.join(', ')}
        WHERE ci_nit = ?
    `;

    db.query(query, valores, (err) => {
        if (err) {
            console.error('[CLIENTES] Error al actualizar:', err.message);
            return callback(err, null);
        }
        callback(null, { ci_nit });
    });
};

/* =========================
   EXPORTS
   ========================= */

module.exports = {
    crearCliente,
    obtenerClientes,
    obtenerClientePorId,
    actualizarCliente,
    cifrar,
    descifrar
};
