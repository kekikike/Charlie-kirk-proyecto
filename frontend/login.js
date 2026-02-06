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
    if (form) {
        form.addEventListener('submit', handleLogin);
    }
    
    // Cargar usuario recordado si existe
    const recordado = localStorage.getItem('recordarUsuario');
    if (recordado) {
        try {
            const { correo } = JSON.parse(recordado);
            const usuarioEl = document.getElementById('login-usuario');
            if (usuarioEl) usuarioEl.value = correo;
            const recuerdameEl = document.getElementById('remember-checkbox');
            if (recuerdameEl) recuerdameEl.checked = true;
        } catch (e) {
            localStorage.removeItem('recordarUsuario');
        }
    }
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

    const usuarioEl = document.getElementById('login-usuario');
    const passEl = document.getElementById('login-contraseña');
    const recuerdameEl = document.getElementById('remember-checkbox');

    const usuario = usuarioEl ? usuarioEl.value.trim() : '';
    const contraseña = passEl ? passEl.value : '';
    const recuerdame = recuerdameEl ? recuerdameEl.checked : false;

    Logger && Logger.agregar && Logger.agregar('LOGIN', `Iniciando login con usuario: ${usuario}`, 'info');

    // Validaciones básicas
    if (!usuario || !contraseña) {
        mostrarAlerta('Por favor, complete todos los campos', 'error');
        return;
    }

    try {
        // Llamar al servicio de autenticación
        Logger && Logger.agregar && Logger.agregar('LOGIN', 'Llamando a AuthService.login...', 'info');
        const resultado = await AuthService.login(usuario, contraseña);

        Logger && Logger.agregar && Logger.agregar('LOGIN', `Resultado del login: ${JSON.stringify(resultado)}`, 'info');

        if (resultado.success) {
            // Login exitoso → limpiar intentos
            reiniciarIntentos();

            Logger && Logger.agregar && Logger.agregar('LOGIN', 'Login exitoso, guardando datos...', 'info');
            mostrarAlerta('¡Bienvenido!', 'success');

            // Verificar que el token se guardó correctamente
            const tokenGuardado = localStorage.getItem('token');
            Logger && Logger.agregar && Logger.agregar('LOGIN', `Token guardado: ${tokenGuardado ? 'SÍ' : 'NO'}`, 'info');

            // Guardar preferencia de "Recuérdame" si está marcado
            if (recuerdame) {
                localStorage.setItem('recordarUsuario', JSON.stringify({ correo: usuario, timestamp: Date.now() }));
            } else {
                localStorage.removeItem('recordarUsuario');
            }

            // Redirigir al dashboard después de 1.5 segundos
            Logger && Logger.agregar && Logger.agregar('LOGIN', 'Redirigiendo a dashboard en 1.5 segundos...', 'info');
            setTimeout(() => {
                Logger && Logger.agregar && Logger.agregar('LOGIN', 'Ejecutando redirección...', 'info');
                window.location.href = 'index.html';
            }, 1500);
        } else {
            // Registrar intento fallido y mostrar mensaje
            registrarIntentoFallido();
            Logger && Logger.agregar && Logger.agregar('LOGIN', `Error en login: ${resultado.error}`, 'error');
            mostrarAlerta(resultado.error || 'Credenciales incorrectas', 'error');
            if (passEl) passEl.value = '';
        }
    } catch (error) {
        Logger && Logger.agregar && Logger.agregar('LOGIN', `Error de conexión: ${error.message}`, 'error');
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
        localStorage.setItem('login_bloqueo', Date.now().toString());
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
    return Math.max(0, Math.ceil(restanteMs / 1000));
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
    if (!alertElement) {
        // Fallback si el markup no tiene contenedor de alertas
        try {
            alert(mensaje);
        } catch (e) {
            console.log(`${tipo.toUpperCase()}: ${mensaje}`);
        }
        return;
    }

    alertElement.textContent = mensaje;
    alertElement.className = `alert alert-${tipo}`;
    alertElement.style.display = 'block';

    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 5000);
}
