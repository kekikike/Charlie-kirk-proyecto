/**
 * App principal - Solo maneja la lógica de UI
 * Las llamadas a API se hacen a través de AuthService
 */

// Elementos del DOM
const perfilTab = document.getElementById('perfil-tab');
const loginForm = document.getElementById('login-form');
const alertDiv = document.getElementById('alert');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);

/**
 * Muestra una alerta en pantalla
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de alerta (success, error, info)
 */
function mostrarAlerta(mensaje, tipo = 'info') {
    alertDiv.textContent = mensaje;
    alertDiv.className = `alert show ${tipo}`;
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
    }, 4000);
}

/**
 * Maneja el envío del formulario de login
 * @param {Event} e - Evento del formulario
 */
async function handleLogin(e) {
    e.preventDefault();

    const usuario = document.getElementById('login-usuario').value;
    const contraseña = document.getElementById('login-contraseña').value;

    const btn = loginForm.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Ingresando...';

    // Llamar al servicio de autenticación
    const resultado = await AuthService.login(usuario, contraseña);

    if (resultado.success) {
        mostrarAlerta('¡Bienvenido ' + resultado.data.usuario.nombre1 + '!', 'success');
        loginForm.reset();
        
        setTimeout(() => {
            mostrarPerfil();
        }, 1500);
    } else {
        mostrarAlerta(resultado.error, 'error');
    }

    btn.disabled = false;
    btn.textContent = 'Ingresar';
}

/**
 * Muestra la pantalla de perfil del usuario
 */
async function mostrarPerfil() {
    // Verificar autenticación
    if (!AuthService.estaAutenticado()) {
        mostrarLogin();
        mostrarAlerta('Debes iniciar sesión primero', 'error');
        return;
    }

    // Obtener datos del perfil
    const resultado = await AuthService.obtenerPerfil();

    if (resultado.success) {
        const perfil = resultado.data;
        const perfilContent = document.getElementById('perfil-content');

        // Cambiar vista
        document.getElementById('login-form').parentElement.style.display = 'none';
        perfilTab.style.display = 'block';

        // Renderizar perfil
        perfilContent.innerHTML = `
            <div class="perfil-item">
                <div class="perfil-label">ID Empleado</div>
                <div class="perfil-valor">${perfil.ciempleado}</div>
            </div>
            <div class="perfil-item">
                <div class="perfil-label">Nombre</div>
                <div class="perfil-valor">${perfil.nombre1 || 'N/A'} ${perfil.nombre2 || ''}</div>
            </div>
            <div class="perfil-item">
                <div class="perfil-label">Apellido</div>
                <div class="perfil-valor">${perfil.apellido1 || 'N/A'} ${perfil.apellido2 || ''}</div>
            </div>
            <div class="perfil-item">
                <div class="perfil-label">Correo</div>
                <div class="perfil-valor">${perfil.correo || 'N/A'}</div>
            </div>
            <div class="perfil-item">
                <div class="perfil-label">Teléfono</div>
                <div class="perfil-valor">${perfil.telefono || 'N/A'}</div>
            </div>
            <div class="perfil-item">
                <div class="perfil-label">Fecha de Registro</div>
                <div class="perfil-valor">${new Date(perfil.fecharegistro).toLocaleDateString('es-ES')}</div>
            </div>
        `;
    } else {
        mostrarAlerta(resultado.error, 'error');
        cerrarSesion();
    }
}

/**
 * Muestra la pantalla de login
 */
function mostrarLogin() {
    document.getElementById('login-form').parentElement.style.display = 'block';
    perfilTab.style.display = 'none';
}

/**
 * Cierra la sesión del usuario
 */
function cerrarSesion() {
    AuthService.logout();
    document.getElementById('perfil-content').innerHTML = '';
    mostrarLogin();
    mostrarAlerta('Sesión cerrada correctamente', 'info');
}

/**
 * Inicialización - Verifica si hay sesión activa
 */
window.addEventListener('load', () => {
    if (AuthService.estaAutenticado()) {
        mostrarPerfil();
    }
});
