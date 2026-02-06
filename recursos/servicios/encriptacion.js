/**
 * Servicios de Encriptación - Encriptación simétrica para datos sensibles
 * Usa crypto nativo de Node.js (AES-256-CBC)
 */

const crypto = require('crypto');

// Llave de encriptación (32 bytes para AES-256) - En producción, usar variable de entorno
// Por ahora usando una llave fija, idealmente debería venir de .env
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'kirkmark_2025_encryption_key_32bytes!!';
const ENCRYPTION_IV = process.env.ENCRYPTION_IV || 'kirkmark_iv_16!!!';

/**
 * Valida que la llave tenga el tamaño correcto
 */
const validarLlave = () => {
    if (ENCRYPTION_KEY.length < 32) {
        console.error('ADVERTENCIA: ENCRYPTION_KEY debe tener al menos 32 bytes');
    }
    if (ENCRYPTION_IV.length < 16) {
        console.error('ADVERTENCIA: ENCRYPTION_IV debe tener al menos 16 bytes');
    }
};

/**
 * Encripta un texto
 * @param {string} texto - Texto a encriptar
 * @returns {string} Texto encriptado en formato hex
 */
const encriptarDato = (texto) => {
    try {
        if (!texto) return null;
        
        const cipher = crypto.createCipheriv(
            'aes-256-cbc',
            Buffer.from(ENCRYPTION_KEY.padEnd(32, '0')).slice(0, 32),
            Buffer.from(ENCRYPTION_IV.padEnd(16, '0')).slice(0, 16)
        );
        
        let encriptado = cipher.update(String(texto), 'utf8', 'hex');
        encriptado += cipher.final('hex');
        
        return encriptado;
    } catch (error) {
        console.error('[ENCRIPTACION] Error al encriptar:', error);
        return null;
    }
};

/**
 * Desencripta un texto
 * @param {string} textoCifrado - Texto encriptado en formato hex
 * @returns {string} Texto original desencriptado
 */
const desencriptarDato = (textoCifrado) => {
    try {
        if (!textoCifrado) return null;
        
        const decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            Buffer.from(ENCRYPTION_KEY.padEnd(32, '0')).slice(0, 32),
            Buffer.from(ENCRYPTION_IV.padEnd(16, '0')).slice(0, 16)
        );
        
        let desencriptado = decipher.update(textoCifrado, 'hex', 'utf8');
        desencriptado += decipher.final('utf8');
        
        return desencriptado;
    } catch (error) {
        console.error('[DESENCRIPTACION] Error al desencriptar:', error);
        return null;
    }
};

/**
 * Oculta un dato sensible mostrando solo los últimos N caracteres
 * @param {string} dato - Dato a ocultar
 * @param {number} ultimosCaracteres - Cantidad de caracteres a mostrar al final
 * @returns {string} Dato con asteriscos
 */
const ocultarDato = (dato, ultimosCaracteres = 4) => {
    if (!dato) return '***';
    const stringDato = String(dato);
    if (stringDato.length <= ultimosCaracteres) return '*'.repeat(stringDato.length);
    return '*'.repeat(stringDato.length - ultimosCaracteres) + stringDato.slice(-ultimosCaracteres);
};

module.exports = {
    encriptarDato,
    desencriptarDato,
    ocultarDato,
    validarLlave
};
