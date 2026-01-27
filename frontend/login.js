/**
 * login.js - Maneja la lógica del formulario de login
 * Valida credenciales, llama al servicio de autenticación
 * y redirige al dashboard en caso de éxito
 */

// Cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Limpiar caché si viene de un logout
    const params = new URLSearchParams(window.location.search);
    if (params.get('logout') === 'true') {
        // Limpiar localStorage completamente
        localStorage.clear();
        sessionStorage.clear();
        // Limpiar historial
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    const form = document.getElementById('login-form');
    form.addEventListener('submit', handleLogin);
});

/**
 * Maneja el envío del formulario de login
 * @param {Event} e - Evento del formulario
 */
async function handleLogin(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const usuario = document.getElementById('login-usuario').value;
    const contraseña = document.getElementById('login-contraseña').value;
    const recuerdame = document.getElementById('remember-checkbox').checked;
    
    // Validaciones básicas
    if (!usuario || !contraseña) {
        mostrarAlerta('Por favor, complete todos los campos', 'error');
        return;
    }
    
    try {
        // Llamar al servicio de autenticación
        const resultado = await AuthService.login(usuario, contraseña);
        
        if (resultado.success) {
            // Login exitoso
            mostrarAlerta('¡Bienvenido!', 'success');
            
            // Guardar preferencia de "Recuérdame" si está marcado
            if (recuerdame) {
                localStorage.setItem('recordarUsuario', JSON.stringify({
                    correo: usuario,
                    timestamp: new Date().getTime()
                }));
            }
            
            // Redirigir al dashboard después de 1.5 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            // Error en login
            mostrarAlerta(resultado.error || 'Error al iniciar sesión', 'error');
            document.getElementById('login-contraseña').value = '';
        }
    } catch (error) {
        mostrarAlerta('Error de conexión con el servidor', 'error');
    }
}

/**
 * Muestra una alerta al usuario
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de alerta: 'success', 'error', 'info'
 */
function mostrarAlerta(mensaje, tipo = 'info') {
    const alertElement = document.getElementById('alert');
    
    alertElement.textContent = mensaje;
    alertElement.className = `alert alert-${tipo}`;
    alertElement.style.display = 'block';
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 5000);
}
