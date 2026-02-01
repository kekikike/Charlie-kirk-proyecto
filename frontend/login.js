/**
 * login.js - Maneja la lógica del formulario de login
 * Implementa bloqueo por intentos fallidos
 */

const MAX_INTENTOS = 3;
const BLOQUEO_MINUTOS = 5;
const BLOQUEO_MS = BLOQUEO_MINUTOS * 60 * 1000;

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    if (params.get('logout') === 'true') {
        localStorage.clear();
        sessionStorage.clear();
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const form = document.getElementById('login-form');
    form.addEventListener('submit', handleLogin);
});

/**
 * Maneja el envío del formulario de login
 */
async function handleLogin(e) {
    e.preventDefault();

    // Verificar si está bloqueado
    if (estaBloqueado()) {
        const tiempoRestante = obtenerTiempoRestante();
        mostrarAlerta(
            `Demasiados intentos. Intente nuevamente en ${tiempoRestante} segundos.`,
            'error'
        );
        return;
    }

    const usuario = document.getElementById('login-usuario').value;
    const contraseña = document.getElementById('login-contraseña').value;
    const recuerdame = document.getElementById('remember-checkbox').checked;

    if (!usuario || !contraseña) {
        mostrarAlerta('Por favor, complete todos los campos', 'error');
        return;
    }

    try {
        const resultado = await AuthService.login(usuario, contraseña);

        if (resultado.success) {
            // Login exitoso → limpiar intentos
            reiniciarIntentos();

            mostrarAlerta('¡Bienvenido!', 'success');

            if (recuerdame) {
                localStorage.setItem(
                    'recordarUsuario',
                    JSON.stringify({
                        correo: usuario,
                        timestamp: Date.now()
                    })
                );
            }

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            registrarIntentoFallido();
            mostrarAlerta(
                resultado.error || 'Credenciales incorrectas',
                'error'
            );
            document.getElementById('login-contraseña').value = '';
        }
    } catch (error) {
        mostrarAlerta('Error de conexión con el servidor', 'error');
    }
}

/**
 * Registra un intento fallido
 */
function registrarIntentoFallido() {
    let intentos = Number(localStorage.getItem('login_intentos')) || 0;
    intentos++;
    localStorage.setItem('login_intentos', intentos);

    if (intentos >= MAX_INTENTOS) {
        localStorage.setItem('login_bloqueo', Date.now());
    }
}

/**
 * Verifica si el login está bloqueado
 */
function estaBloqueado() {
    const bloqueo = Number(localStorage.getItem('login_bloqueo'));
    if (!bloqueo) return false;

    const ahora = Date.now();
    if (ahora - bloqueo > BLOQUEO_MS) {
        reiniciarIntentos();
        return false;
    }

    return true;
}

/**
 * Obtiene tiempo restante de bloqueo en segundos
 */
function obtenerTiempoRestante() {
    const bloqueo = Number(localStorage.getItem('login_bloqueo'));
    const ahora = Date.now();
    const restanteMs = BLOQUEO_MS - (ahora - bloqueo);
    return Math.ceil(restanteMs / 1000);
}

/**
 * Reinicia intentos y bloqueo
 */
function reiniciarIntentos() {
    localStorage.removeItem('login_intentos');
    localStorage.removeItem('login_bloqueo');
}

/**
 * Muestra una alerta al usuario
 */
function mostrarAlerta(mensaje, tipo = 'info') {
    const alertElement = document.getElementById('alert');

    alertElement.textContent = mensaje;
    alertElement.className = `alert alert-${tipo}`;
    alertElement.style.display = 'block';

    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 5000);
}
