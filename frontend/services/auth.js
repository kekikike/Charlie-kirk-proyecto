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

            if (!response.ok) {
                throw new Error(data.mensaje || 'Error en el login');
            }

            // Guardar datos en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));

            return { success: true, data };
        } catch (error) {
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
                throw new Error('No hay sesión activa');
            }

            const response = await fetch(`${API_URL}/perfil`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al cargar perfil');
            }

            return { success: true, data: data.usuario };
        } catch (error) {
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
        return localStorage.getItem('token');
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
        return !!this.getToken();
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
