/**
 * Servicio de Autenticación
 * Maneja todas las comunicaciones con la API de autenticación
 */

const API_URL = 'http://localhost:3000/api/auth';

const AuthService = {
    /**
     * Realiza login del usuario
     * @param {string} correo - Correo del usuario
     * @param {string} contraseña - Contraseña del usuario
     * @returns {Promise<Object>} Datos del usuario y token
     */
    async login(correo, contraseña) {
        try {
            Logger.agregar('AuthService', `Enviando login para: ${correo}`, 'info');
            
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    correo,
                    contraseña
                })
            });

            const data = await response.json();

            Logger.agregar('AuthService', `Respuesta del servidor: ${response.status}`, 'info');

            if (!response.ok) {
                Logger.agregar('AuthService', `Error en login: ${JSON.stringify(data)}`, 'error');
                throw new Error(data.mensaje || 'Error en el login');
            }

            if (!data.token) {
                Logger.agregar('AuthService', 'No se recibió token', 'error');
                throw new Error('No se recibió token de autenticación');
            }

            Logger.agregar('AuthService', 'Token recibido, guardando...', 'info');
            
            // Guardar datos en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));

            Logger.agregar('AuthService', 'Datos guardados en localStorage', 'info');
            Logger.agregar('AuthService', `Token: ${data.token.substring(0, 30)}...`, 'info');
            Logger.agregar('AuthService', `Usuario: ${data.usuario.nombre1}`, 'info');

            return { success: true, data };
        } catch (error) {
            Logger.agregar('AuthService', `Error en login: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    },

    /**
     * Obtiene el perfil del usuario autenticado
     * @returns {Promise<Object>} Datos del perfil
     */
    async obtenerPerfil() {
        try {
            const token = this.getToken();

            if (!token) {
                Logger.agregar('AUTH', 'No hay token disponible', 'warn');
                throw new Error('No hay sesión activa');
            }

            Logger.agregar('AUTH', `Obteniendo perfil con token: ${token.substring(0, 20)}...`, 'info');

            const response = await fetch(`${API_URL}/perfil`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            Logger.agregar('AUTH', `Respuesta del servidor: ${response.status}`, 'info');

            if (!response.ok) {
                Logger.agregar('AUTH', `Error en respuesta: ${JSON.stringify(data)}`, 'error');
                throw new Error(data.mensaje || data.error || 'Error al cargar perfil');
            }

            if (!data.usuario) {
                Logger.agregar('AUTH', 'No se encontró usuario en respuesta', 'error');
                throw new Error('Respuesta inválida del servidor');
            }

            Logger.agregar('AUTH', `Perfil cargado exitosamente: ${data.usuario.nombre1}`, 'info');
            return { success: true, data: data.usuario };
        } catch (error) {
            Logger.agregar('AUTH', `Error en obtenerPerfil: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    },

    /**
     * Registra un nuevo usuario (solo administrador)
     * @param {Object} userData - Datos del usuario a registrar
     * @returns {Promise<Object>} Resultado del registro
     */
    async registrarUsuario(userData) {
        try {
            const token = this.getToken();

            if (!token) {
                throw new Error('Debe estar autenticado para registrar usuarios');
            }

            const response = await fetch(`${API_URL}/registro`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensaje || 'Error en el registro');
            }

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Obtiene el token guardado
     * @returns {string|null} Token JWT
     */
    getToken() {
        const token = localStorage.getItem('token');
        console.log('[AuthService] getToken() retorna:', token ? 'SÍ (token presente)' : 'NO (sin token)');
        return token;
    },

    /**
     * Obtiene los datos del usuario guardados
     * @returns {Object|null} Datos del usuario
     */
    getUsuario() {
        const usuario = localStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
    },

    /**
     * Verifica si hay una sesión activa
     * @returns {boolean}
     */
    estaAutenticado() {
        const token = this.getToken();
        const autenticado = !!token;
        Logger.agregar('AuthService', `estaAutenticado() retorna: ${autenticado}`, 'info');
        return autenticado;
    },

    /**
     * Cierra la sesión del usuario
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    }
};

// Exportar servicio
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthService;
}
