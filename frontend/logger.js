/**
 * Sistema de Logging Persistente
 * Guarda todos los logs en localStorage para diagnóstico
 */

const Logger = {
    // Clave para localStorage
    LOGS_KEY: 'DEBUG_LOGS',
    MAX_LOGS: 100,
    
    /**
     * Inicia un nuevo registro de logs (limpia los anteriores)
     */
    iniciar() {
        this.limpiar();
        this.agregar('INICIO', 'Sistema de logging iniciado', 'info');
    },
    
    /**
     * Agrega un log al registro
     * @param {string} categoria - Categoría del log (LOGIN, AUTH, DASHBOARD, etc)
     * @param {string} mensaje - Mensaje del log
     * @param {string} tipo - Tipo: 'info', 'warn', 'error'
     */
    agregar(categoria, mensaje, tipo = 'info') {
        try {
            const timestamp = new Date().toLocaleTimeString('es-ES');
            const log = {
                timestamp,
                categoria,
                mensaje,
                tipo
            };
            
            // Obtener logs existentes
            let logs = JSON.parse(localStorage.getItem(this.LOGS_KEY) || '[]');
            
            // Agregar nuevo log
            logs.push(log);
            
            // Limitar cantidad de logs
            if (logs.length > this.MAX_LOGS) {
                logs = logs.slice(-this.MAX_LOGS);
            }
            
            // Guardar en localStorage
            localStorage.setItem(this.LOGS_KEY, JSON.stringify(logs));
            
            // También imprimir en consola
            const color = tipo === 'error' ? 'color: red; font-weight: bold;' : 
                         tipo === 'warn' ? 'color: orange; font-weight: bold;' : 
                         'color: blue;';
            console.log(`%c[${categoria}] ${mensaje}`, color);
            
        } catch (e) {
            console.error('Error en Logger.agregar:', e);
        }
    },
    
    /**
     * Obtiene todos los logs guardados
     * @returns {Array} Array de logs
     */
    obtenerLogs() {
        try {
            return JSON.parse(localStorage.getItem(this.LOGS_KEY) || '[]');
        } catch (e) {
            return [];
        }
    },
    
    /**
     * Obtiene los logs como texto formateado
     * @returns {string} Logs formateados para mostrar
     */
    obtenerTexto() {
        const logs = this.obtenerLogs();
        return logs.map(log => 
            `[${log.timestamp}] ${log.categoria}: ${log.mensaje}`
        ).join('\n');
    },
    
    /**
     * Muestra los logs en una modal
     */
    mostrarModal() {
        const logs = this.obtenerTexto();
        
        // Crear modal HTML
        const modal = document.createElement('div');
        modal.id = 'debug-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        const contenido = document.createElement('div');
        contenido.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 80%;
            max-width: 900px;
            max-height: 600px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        
        const titulo = document.createElement('h2');
        titulo.textContent = '🔍 Logs de Depuración';
        titulo.style.marginTop = '0';
        
        const textarea = document.createElement('textarea');
        textarea.value = logs;
        textarea.readOnly = true;
        textarea.style.cssText = `
            flex: 1;
            padding: 10px;
            font-family: monospace;
            font-size: 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin: 10px 0;
            overflow: auto;
        `;
        
        const botones = document.createElement('div');
        botones.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';
        
        const btnCopiar = document.createElement('button');
        btnCopiar.textContent = 'Copiar al Portapapeles';
        btnCopiar.style.cssText = `
            padding: 8px 16px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        btnCopiar.onclick = () => {
            textarea.select();
            document.execCommand('copy');
            btnCopiar.textContent = '✓ Copiado!';
            setTimeout(() => btnCopiar.textContent = 'Copiar al Portapapeles', 2000);
        };
        
        const btnCerrar = document.createElement('button');
        btnCerrar.textContent = 'Cerrar';
        btnCerrar.style.cssText = `
            padding: 8px 16px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        btnCerrar.onclick = () => modal.remove();
        
        botones.appendChild(btnCopiar);
        botones.appendChild(btnCerrar);
        
        contenido.appendChild(titulo);
        contenido.appendChild(textarea);
        contenido.appendChild(botones);
        modal.appendChild(contenido);
        
        document.body.appendChild(modal);
    },
    
    /**
     * Limpia los logs guardados
     */
    limpiar() {
        try {
            localStorage.removeItem(this.LOGS_KEY);
        } catch (e) {
            console.error('Error al limpiar logs:', e);
        }
    }
};

// Iniciar logging cuando se carga el script
Logger.iniciar();
