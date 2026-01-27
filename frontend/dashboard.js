/**
 * dashboard.js - Maneja la lógica del dashboard principal
 * Gestiona navegación entre secciones, carga de datos y protección de autenticación
 */

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacion();
    configurarNavegacion();
    configurarFormulario();
    cargarDatos();
});

/**
 * Verifica si el usuario está autenticado
 * Si no, redirige al login
 */
async function verificarAutenticacion() {
    if (!AuthService.estaAutenticado()) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        // Obtener datos del usuario
        const resultado = await AuthService.obtenerPerfil();
        
        if (resultado.success) {
            const usuario = resultado.data;
            
            // Mostrar datos del usuario en navbar
            document.getElementById('usuario-nombre').textContent = usuario.nombre1;
            document.getElementById('usuario-rol').textContent = 
                usuario.rol === 1 ? 'Administrador' : 'Vendedor';
            
            // Actualizar breadcrumb
            actualizarBreadcrumb(usuario.nombre1);
            
            // Mostrar opciones según el rol
            const esAdmin = usuario.rol === 1;
            mostrarOpcionesAdmin(esAdmin);
        } else {
            // Token inválido, redirigir a login
            AuthService.logout();
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        AuthService.logout();
        window.location.href = 'login.html';
    }
}

/**
 * Actualiza el breadcrumb con el nombre del usuario
 * @param {string} nombre - Nombre del usuario
 */
function actualizarBreadcrumb(nombre) {
    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = `<span class="breadcrumb-item active">${nombre}</span>`;
    }
}

/**
 * Muestra u oculta opciones del menú según el rol del usuario
 * @param {boolean} esAdmin - Si el usuario es administrador
 */
function mostrarOpcionesAdmin(esAdmin) {
    const navEmpleados = document.getElementById('nav-empleados');
    const navUsuarios = document.getElementById('nav-usuarios');
    const navRespaldo = document.getElementById('nav-respaldo');
    
    if (esAdmin) {
        if (navEmpleados) navEmpleados.style.display = 'block';
        if (navUsuarios) navUsuarios.style.display = 'block';
        if (navRespaldo) navRespaldo.style.display = 'block';
    } else {
        if (navEmpleados) navEmpleados.style.display = 'none';
        if (navUsuarios) navUsuarios.style.display = 'none';
        if (navRespaldo) navRespaldo.style.display = 'none';
    }
}

/**
 * Configura los eventos de navegación del menú
 */
function configurarNavegacion() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            cambiarSeccion(section);
            
            // Actualizar clase activa en menú
            navItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Cambia la sección visible del dashboard
 * @param {string} section - Nombre de la sección a mostrar
 */
function cambiarSeccion(section) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.classList.remove('active'));
    
    // Mostrar la sección seleccionada
    const selectedSection = document.getElementById(section + '-section');
    if (selectedSection) {
        selectedSection.classList.add('active');
        selectedSection.style.display = 'block';
        
        // Actualizar breadcrumb
        const sectionNames = {
            'dashboard': 'Inicio',
            'ventas': 'Ventas',
            'productos': 'Productos',
            'inventario': 'Inventario',
            'empleados': 'Empleados',
            'usuarios': 'Usuarios',
            'reportes': 'Reports',
            'ajustes': 'Ajustes',
            'historial': 'Historial'
        };
        
        const breadcrumb = document.getElementById('breadcrumb');
        if (breadcrumb) {
            breadcrumb.innerHTML = `<span class="breadcrumb-item">${sectionNames[section] || 'Inicio'}</span>`;
        }
        
        // Cargar datos específicos de la sección
        if (section === 'usuarios') {
            limpiarFormulario();
        } else if (section === 'empleados') {
            cargarEmpleados();
        } else if (section === 'productos') {
            cargarProductos();
        } else if (section === 'inventario') {
            cargarInventario();
        }
    }
}

/**
 * Vuelve a la sección anterior (dashboard)
 */
function volverAtras() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(n => n.classList.remove('active'));
    const dashboardLink = document.querySelector('[data-section="dashboard"]');
    if (dashboardLink) {
        dashboardLink.classList.add('active');
    }
    cambiarSeccion('dashboard');
}

/**
 * Configura el formulario de usuarios
 */
function configurarFormulario() {
    const form = document.getElementById('form-usuario');
    if (form) {
        form.addEventListener('submit', handleRegistrarUsuario);
    }

    const formProducto = document.getElementById('form-producto');
    if (formProducto) {
        // Asegurar que el handler sea el de crear
        formProducto.addEventListener('submit', handleCrearProducto);
    }

    const formInventario = document.getElementById('form-inventario');
    if (formInventario) {
        formInventario.addEventListener('submit', handleCrearInventario);
    }
}

/**
 * Maneja el envío del formulario de registro de usuario
 * @param {Event} e - Evento del formulario
 */
async function handleRegistrarUsuario(e) {
    e.preventDefault();
    
    // Obtener valores
    const nombre1 = document.getElementById('nombre1').value;
    const nombre2 = document.getElementById('nombre2').value;
    const apellido1 = document.getElementById('apellido1').value;
    const apellido2 = document.getElementById('apellido2').value;
    const fechanac = document.getElementById('fechanac').value;
    const sexo = document.getElementById('sexo').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;
    const contraseña = document.getElementById('contraseña').value;
    const confirmarContraseña = document.getElementById('confirmar-contraseña').value;
    const rol = document.getElementById('rol').value;
    
    // Validaciones
    if (!nombre1 || !apellido1 || !correo || !telefono || !fechanac || !sexo || !contraseña || !rol) {
        mostrarAlerta('Por favor, complete todos los campos requeridos', 'error');
        return;
    }
    
    if (contraseña !== confirmarContraseña) {
        mostrarAlerta('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (contraseña.length < 6) {
        mostrarAlerta('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    try {
        // Llamar al servicio de registro
        const userData = {
            nombre1,
            nombre2,
            apellido1,
            apellido2,
            fechanac,
            sexo: parseInt(sexo),
            correo,
            telefono: parseInt(telefono),
            contraseña,
            rol: parseInt(rol)
        };
        
        const resultado = await AuthService.registrarUsuario(userData);
        
        if (resultado.success) {
            mostrarAlerta('Usuario registrado exitosamente', 'success');
            limpiarFormulario();
            setTimeout(() => volverAtras(), 1500);
        } else {
            mostrarAlerta(resultado.error || 'Error al registrar usuario', 'error');
        }
    } catch (error) {
        console.error('Error registrando usuario:', error);
        mostrarAlerta('Error de conexión con el servidor', 'error');
    }
}

/**
 * Maneja el envío del formulario de crear producto
 * @param {Event} e - Evento del formulario
 */
async function handleCrearProducto(e) {
    e.preventDefault();

    const nombre = document.getElementById('producto-nombre').value;
    const idcategoria = document.getElementById('producto-categoria').value;
    const preciounitario = document.getElementById('producto-precio').value;

    if (!nombre || !idcategoria || !preciounitario) {
        mostrarAlerta('Por favor complete todos los campos', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
            },
            body: JSON.stringify({
                nombre,
                idcategoria: parseInt(idcategoria),
                preciounitario: parseFloat(preciounitario)
            })
        });

        if (!response.ok) {
            throw new Error('Error al crear producto');
        }

        mostrarAlerta('Producto creado exitosamente', 'success');
        cerrarModalProducto();
        cargarProductos();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al crear producto', 'error');
    }
}

/**
 * Maneja la actualización de un producto
 * @param {string} codproducto - Código del producto a actualizar
 */
async function handleActualizarProducto(codproducto) {
    const nombre = document.getElementById('producto-nombre').value;
    const idcategoria = document.getElementById('producto-categoria').value;
    const preciounitario = document.getElementById('producto-precio').value;

    if (!nombre || !idcategoria || !preciounitario) {
        mostrarAlerta('Por favor complete todos los campos', 'error');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/productos/${codproducto}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
            },
            body: JSON.stringify({
                nombre,
                idcategoria: parseInt(idcategoria),
                preciounitario: parseFloat(preciounitario)
            })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar producto');
        }

        mostrarAlerta('Producto actualizado exitosamente', 'success');
        
        // Restaurar handler original
        const form = document.getElementById('form-producto');
        form.onsubmit = null;
        form.removeEventListener('submit', form.onsubmit);
        form.addEventListener('submit', handleCrearProducto);
        
        cerrarModalProducto();
        cargarProductos();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al actualizar producto', 'error');
    }
}

/**
 * Maneja el envío del formulario de agregar inventario
 * @param {Event} e - Evento del formulario
 */
async function handleCrearInventario(e) {
    e.preventDefault();

    const codproducto = document.getElementById('inventario-producto').value;
    const stock = document.getElementById('inventario-stock').value;
    const fechaingreso = document.getElementById('inventario-ingreso').value;
    const fechavencimiento = document.getElementById('inventario-vencimiento').value;

    if (!codproducto || !stock || !fechaingreso) {
        mostrarAlerta('Por favor complete los campos requeridos', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/inventario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
            },
            body: JSON.stringify({
                codproducto,
                stock: parseInt(stock),
                fechaingreso,
                fechavencimiento: fechavencimiento || null
            })
        });

        if (!response.ok) {
            throw new Error('Error al crear lote');
        }

        mostrarAlerta('Lote agregado exitosamente', 'success');
        cerrarModalInventario();
        cargarInventario();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al crear lote', 'error');
    }
}

/**
 * Limpia el formulario de usuarios
 */
function limpiarFormulario() {
    const form = document.getElementById('form-usuario');
    if (form) {
        form.reset();
    }
}

/**
 * Carga datos iniciales del dashboard
 */
async function cargarDatos() {
    // Por ahora solo mostramos valores de demostración
    // En el futuro se conectarán a endpoints reales
}

/**
 * Abre el formulario para crear un nuevo producto
 */
function abrirFormularioProducto() {
    cambiarSeccion('productos');
}

/**
 * Abre el formulario para crear un nuevo usuario
 */
function abrirFormularioUsuario() {
    cambiarSeccion('usuarios');
}

/**
 * Abre el formulario para editar el perfil
 */
function editarPerfil() {
    mostrarAlerta('Función de edición de perfil en desarrollo', 'info');
}

/**
 * Abre el formulario para cambiar la contraseña
 */
function cambiarContraseña() {
    mostrarAlerta('Función de cambio de contraseña en desarrollo', 'info');
}

/**
 * Cierra la sesión del usuario y redirige al login
 */
function cerrarSesion() {
    if (confirm('¿Está seguro de que desea cerrar sesión?')) {
        AuthService.logout();
        // Hacer un hard refresh para limpiar el caché
        window.location.href = 'login.html?logout=true';
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

/**
 * Carga la lista de empleados
 */
async function cargarEmpleados() {
    try {
        const response = await fetch('http://localhost:3000/api/auth/empleados', {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar empleados');
        }

        const data = await response.json();
        mostrarEmpleados(data.empleados);
    } catch (error) {
        console.error('Error cargando empleados:', error);
        mostrarAlerta('Error al cargar empleados', 'error');
    }
}

/**
 * Muestra la lista de empleados en la tabla
 * @param {Array} empleados - Lista de empleados
 */
function mostrarEmpleados(empleados) {
    const tbody = document.getElementById('empleados-lista');
    
    if (!empleados || empleados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No hay empleados registrados</td></tr>';
        return;
    }

    tbody.innerHTML = empleados.map(emp => {
        const nombre = `${emp.nombre1} ${emp.nombre2 || ''}`.trim();
        const apellido = `${emp.apellido1} ${emp.apellido2 || ''}`.trim();
        const rolNombre = emp.rol === 1 ? 'Administrador' : 'Vendedor';
        const badgeRol = emp.rol === 1 ? 'badge-admin' : 'badge-vendedor';
        const badgeEstado = emp.estado === 1 ? 'badge-activo' : 'badge-inactivo';
        const estadoTexto = emp.estado === 1 ? 'Activo' : 'Inactivo';

        return `
            <tr>
                <td>${emp.ciempleado}</td>
                <td>${nombre}</td>
                <td>${apellido}</td>
                <td>${emp.correo}</td>
                <td>${emp.telefono}</td>
                <td><span class="badge ${badgeRol}">${rolNombre}</span></td>
                <td><span class="badge ${badgeEstado}">${estadoTexto}</span></td>
                <td>
                    <div class="acciones-tabla">
                        <button class="btn-accion btn-editar" onclick="editarEmpleado(${emp.ciempleado})">Editar</button>
                        ${emp.estado === 1 
                            ? `<button class="btn-accion btn-desactivar" onclick="desactivarEmpleado(${emp.ciempleado})">Desactivar</button>`
                            : `<button class="btn-accion btn-desactivar" onclick="activarEmpleado(${emp.ciempleado})">Activar</button>`
                        }
                        <button class="btn-accion btn-eliminar" onclick="eliminarEmpleado(${emp.ciempleado})">Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Abre el formulario para editar un empleado
 * @param {number} ciempleado - ID del empleado
 */
function editarEmpleado(ciempleado) {
    mostrarAlerta('Función de edición de empleados en desarrollo', 'info');
}

/**
 * Desactiva un empleado
 * @param {number} ciempleado - ID del empleado
 */
async function desactivarEmpleado(ciempleado) {
    if (!confirm('¿Está seguro de que desea desactivar este empleado?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/auth/empleados/${ciempleado}/estado`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
            },
            body: JSON.stringify({ estado: 0 })
        });

        if (!response.ok) {
            throw new Error('Error al desactivar empleado');
        }

        mostrarAlerta('Empleado desactivado exitosamente', 'success');
        cargarEmpleados();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al desactivar empleado', 'error');
    }
}

/**
 * Activa un empleado
 * @param {number} ciempleado - ID del empleado
 */
async function activarEmpleado(ciempleado) {
    if (!confirm('¿Está seguro de que desea activar este empleado?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/auth/empleados/${ciempleado}/estado`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
            },
            body: JSON.stringify({ estado: 1 })
        });

        if (!response.ok) {
            throw new Error('Error al activar empleado');
        }

        mostrarAlerta('Empleado activado exitosamente', 'success');
        cargarEmpleados();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al activar empleado', 'error');
    }
}

/**
 * Elimina un empleado
 * @param {number} ciempleado - ID del empleado
 */
async function eliminarEmpleado(ciempleado) {
    if (!confirm('¿Está seguro de que desea eliminar este empleado? Esta acción no se puede deshacer.')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/auth/empleados/${ciempleado}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar empleado');
        }

        mostrarAlerta('Empleado eliminado exitosamente', 'success');
        cargarEmpleados();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al eliminar empleado', 'error');
    }
}

/**
 * Carga la lista de productos
 */
async function cargarProductos() {
    console.log('[CARGAR PRODUCTOS] Iniciando carga de productos');
    try {
        const token = AuthService.getToken();
        console.log('[CARGAR PRODUCTOS] Token:', token ? 'Presente' : 'Ausente');
        
        const response = await fetch('http://localhost:3000/api/productos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('[CARGAR PRODUCTOS] Response status:', response.status);
        
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }

        const data = await response.json();
        console.log('[CARGAR PRODUCTOS] Datos recibidos:', data);
        console.log('[CARGAR PRODUCTOS] Productos:', data.productos);
        mostrarProductos(data.productos);
    } catch (error) {
        console.error('Error cargando productos:', error);
        mostrarAlerta('Error al cargar productos', 'error');
    }
}

/**
 * Carga las categorías disponibles
 */
async function cargarCategorias() {
    try {
        const response = await fetch('http://localhost:3000/api/productos/categorias');
        const data = await response.json();
        
        const selectCategoria = document.getElementById('producto-categoria');
        selectCategoria.innerHTML = '<option value="">Seleccione una categoría</option>';
        
        data.categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.idcategoria;
            option.textContent = cat.nombre;
            selectCategoria.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
}

/**
 * Muestra la lista de productos en la tabla
 * @param {Array} productos - Lista de productos
 */
function mostrarProductos(productos) {
    console.log('[MOSTRAR PRODUCTOS] Iniciando renderizado');
    const tbody = document.getElementById('productos-lista');
    
    if (!tbody) {
        console.error('[MOSTRAR PRODUCTOS] No se encontró elemento productos-lista');
        return;
    }
    
    if (!productos || productos.length === 0) {
        console.log('[MOSTRAR PRODUCTOS] No hay productos para mostrar');
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay productos registrados</td></tr>';
        return;
    }

    console.log(`[MOSTRAR PRODUCTOS] Renderizando ${productos.length} productos`);
    
    tbody.innerHTML = productos.map(prod => {
        console.log(`[MOSTRAR PRODUCTOS] Procesando: ${prod.codproducto}, estado=${prod.estado}, tipo=${typeof prod.estado}`);
        
        // Convertir a número para comparar correctamente
        const estado = parseInt(prod.estado);
        const badgeEstado = estado === 1 ? 'badge-activo' : 'badge-inactivo';
        const estadoTexto = estado === 1 ? 'Activo' : 'Inactivo';
        
        console.log(`[MOSTRAR PRODUCTOS] ${prod.codproducto}: estado convertido=${estado}, badge=${badgeEstado}`);

        return `
            <tr>
                <td>${prod.codproducto}</td>
                <td>${prod.nombre}</td>
                <td>${prod.categoria}</td>
                <td>Bs. ${parseFloat(prod.preciounitario).toFixed(2)}</td>
                <td>${prod.stockTotal || 0} unidades</td>
                <td><span class="badge ${badgeEstado}">${estadoTexto}</span></td>
                <td>
                    <div class="acciones-tabla">
                        <button class="btn-accion btn-editar" onclick="editarProducto('${prod.codproducto}', '${prod.nombre}', ${prod.idcategoria}, ${prod.preciounitario})">Editar</button>
                        ${parseInt(prod.estado) === 1 
                            ? `<button class="btn-accion btn-desactivar" onclick="desactivarProducto('${prod.codproducto}')">Desactivar</button>`
                            : `<button class="btn-accion btn-desactivar" onclick="activarProductoConValidacion('${prod.codproducto}')">Activar</button>`
                        }
                        <button class="btn-accion btn-eliminar" onclick="eliminarProductoConfirm('${prod.codproducto}')">Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Abre el formulario para crear producto
 */
function abrirFormularioProducto() {
    document.getElementById('modal-producto').classList.add('active');
    document.getElementById('modal-producto').style.display = 'flex';
    document.getElementById('modal-titulo').textContent = 'Nuevo Producto';
    document.getElementById('form-producto').reset();
    
    // Asegurar que el handler es el correcto para crear
    const form = document.getElementById('form-producto');
    form.onsubmit = null;
    form.removeEventListener('submit', form.onsubmit);
    form.addEventListener('submit', handleCrearProducto);
    
    cargarCategorias();
}

/**
 * Cierra el modal de producto
 */
function cerrarModalProducto() {
    document.getElementById('modal-producto').classList.remove('active');
    document.getElementById('modal-producto').style.display = 'none';
    
    // Restaurar handler original del formulario
    const form = document.getElementById('form-producto');
    form.removeEventListener('submit', form.onsubmit);
    form.onsubmit = null;
    form.addEventListener('submit', handleCrearProducto);
    
    // Limpiar campos
    document.getElementById('form-producto').reset();
}

/**
 * Edita un producto
 */
function editarProducto(codproducto, nombre, idcategoria, preciounitario) {
    document.getElementById('modal-producto').classList.add('active');
    document.getElementById('modal-producto').style.display = 'flex';
    document.getElementById('modal-titulo').textContent = 'Editar Producto';
    document.getElementById('producto-nombre').value = nombre;
    document.getElementById('producto-categoria').value = idcategoria;
    document.getElementById('producto-precio').value = preciounitario;
    
    // Crear un nuevo form submit handler para edición
    const form = document.getElementById('form-producto');
    const handleEdicion = async (e) => {
        e.preventDefault();
        await handleActualizarProducto(codproducto);
        // Eliminar este handler después de usar
        form.removeEventListener('submit', handleEdicion);
        // Restaurar el handler original para crear
        form.addEventListener('submit', handleCrearProducto);
    };
    
    // Remover listeners anteriores
    form.removeEventListener('submit', handleCrearProducto);
    form.addEventListener('submit', handleEdicion);
    
    cargarCategorias();
}

/**
 * Desactiva un producto
 */
async function desactivarProducto(codproducto) {
    if (!confirm('¿Está seguro de que desea desactivar este producto?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/productos/${codproducto}/desactivar`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al desactivar producto');
        }

        const data = await response.json();
        console.log('Respuesta de desactivar:', data);
        
        mostrarAlerta('Producto desactivado exitosamente', 'success');
        // Agregar delay para asegurar que la BD se actualice
        setTimeout(() => {
            console.log('Recargando productos después de desactivar');
            cargarProductos();
        }, 800);
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al desactivar producto', 'error');
    }
}

/**
 * Valida si se puede activar y luego activa un producto
 */
async function activarProductoConValidacion(codproducto) {
    try {
        // Obtener inventario del producto
        const response = await fetch('http://localhost:3000/api/inventario', {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener inventario');
        }

        const data = await response.json();
        const lotes = data.lotes.filter(lote => lote.codproducto === codproducto) || [];
        const totalStock = lotes.reduce((sum, lote) => sum + lote.stock, 0);

        if (totalStock < 5) {
            mostrarAlerta(`No se puede activar. Stock mínimo requerido: 5 unidades. Stock actual: ${totalStock}`, 'error');
            return;
        }

        if (!confirm('¿Está seguro de que desea activar este producto?')) {
            return;
        }

        await activarProducto(codproducto);
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al validar stock', 'error');
    }
}

/**
 * Activa un producto
 */
async function activarProducto(codproducto) {
    console.log(`[ACTIVAR PRODUCTO] Iniciando activación de: ${codproducto}`);
    try {
        const token = AuthService.getToken();
        const url = `http://localhost:3000/api/productos/${codproducto}/activar`;
        
        console.log(`[ACTIVAR PRODUCTO] URL: ${url}`);
        console.log(`[ACTIVAR PRODUCTO] Token presente: ${token ? 'Sí' : 'No'}`);
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(`[ACTIVAR PRODUCTO] Response status: ${response.status}`);
        
        if (!response.ok) {
            throw new Error('Error al activar producto');
        }

        const data = await response.json();
        console.log('[ACTIVAR PRODUCTO] Respuesta:', data);
        console.log('[ACTIVAR PRODUCTO] Mostrando alerta de éxito');
        
        mostrarAlerta('Producto activado exitosamente', 'success');
        
        console.log(`[ACTIVAR PRODUCTO] Programando recarga de productos en 800ms`);
        // Agregar delay para asegurar que la BD se actualice
        setTimeout(() => {
            console.log('[ACTIVAR PRODUCTO] Ejecutando cargarProductos()');
            cargarProductos();
        }, 800);
    } catch (error) {
        console.error('[ACTIVAR PRODUCTO] Error:', error);
        mostrarAlerta('Error al activar producto', 'error');
    }
}

/**
 * Carga la lista de inventario
 */
async function cargarInventario() {
    try {
        const response = await fetch('http://localhost:3000/api/inventario', {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar inventario');
        }

        const data = await response.json();
        mostrarInventario(data.lotes);
    } catch (error) {
        console.error('Error cargando inventario:', error);
        mostrarAlerta('Error al cargar inventario', 'error');
    }
}

/**
 * Muestra la lista de inventario en la tabla
 * @param {Array} lotes - Lista de lotes
 */
function mostrarInventario(lotes) {
    const tbody = document.getElementById('inventario-lista');
    
    if (!lotes || lotes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No hay lotes registrados</td></tr>';
        return;
    }

    tbody.innerHTML = lotes.map(lote => {
        const badgeEstado = lote.estado === 1 ? 'badge-activo' : 'badge-inactivo';
        const estadoTexto = lote.estado === 1 ? 'Activo' : 'Inactivo';
        const fechaVencimiento = lote.fechavencimiento ? new Date(lote.fechavencimiento).toLocaleDateString('es-ES') : 'S/F';
        const fechaIngreso = new Date(lote.fechaingreso).toLocaleDateString('es-ES');

        return `
            <tr>
                <td>${lote.codinventario}</td>
                <td>${lote.producto}</td>
                <td>${lote.categoria}</td>
                <td>${lote.stock} unidades</td>
                <td>${fechaIngreso}</td>
                <td>${fechaVencimiento}</td>
                <td><span class="badge ${badgeEstado}">${estadoTexto}</span></td>
                <td>
                    <div class="acciones-tabla">
                        <button class="btn-accion btn-editar" onclick="editarStock('${lote.codinventario}')">Editar Stock</button>
                        <button class="btn-accion btn-eliminar" onclick="eliminarInventario('${lote.codinventario}')">Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Abre el modal para agregar inventario
 */
async function abrirFormularioInventario() {
    document.getElementById('modal-inventario').classList.add('active');
    document.getElementById('modal-inventario').style.display = 'flex';
    document.getElementById('form-inventario').reset();
    
    // Cargar productos
    try {
        const response = await fetch('http://localhost:3000/api/productos');
        const data = await response.json();
        
        const selectProducto = document.getElementById('inventario-producto');
        selectProducto.innerHTML = '<option value="">Seleccione un producto</option>';
        
        data.productos.forEach(prod => {
            const option = document.createElement('option');
            option.value = prod.codproducto;
            option.textContent = `${prod.nombre} - Bs. ${parseFloat(prod.preciounitario).toFixed(2)}`;
            selectProducto.appendChild(option);
        });
    } catch (error) {
    }
}

/**
 * Cierra el modal de inventario
 */
function cerrarModalInventario() {
    document.getElementById('modal-inventario').classList.remove('active');
    document.getElementById('modal-inventario').style.display = 'none';
}

/**
 * Edita el stock de un lote
 */
function editarStock(codinventario) {
    const nuevoStock = prompt('Ingrese el nuevo stock:');
    if (nuevoStock === null || nuevoStock === '') return;
    
    actualizarStock(codinventario, parseInt(nuevoStock));
}

/**
 * Actualiza el stock
 */
async function actualizarStock(codinventario, stock) {
    try {
        const response = await fetch(`http://localhost:3000/api/inventario/${codinventario}/stock`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
            },
            body: JSON.stringify({ stock })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar stock');
        }

        mostrarAlerta('Stock actualizado exitosamente', 'success');
        cargarInventario();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al actualizar stock', 'error');
    }
}

/**
 * Elimina un lote de inventario
 */
async function eliminarInventario(codinventario) {
    if (!confirm('¿Está seguro de que desea eliminar este lote?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/inventario/${codinventario}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar lote');
        }

        mostrarAlerta('Lote eliminado exitosamente', 'success');
        cargarInventario();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al eliminar lote', 'error');
    }
}

/**
 * Elimina un producto con confirmación
 */
async function eliminarProductoConfirm(codproducto) {
    if (!confirm('¿Está seguro de que desea eliminar este producto? Esta acción no se puede deshacer.')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/productos/${codproducto}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            // Si hay error, mostrar el mensaje del servidor
            mostrarAlerta(data.error || 'Error al eliminar producto', 'error');
            return;
        }

        mostrarAlerta('Producto eliminado exitosamente', 'success');
        cargarProductos();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al eliminar producto', 'error');
    }
}

/**
 * ========================================
 * MÓDULO DE VENTAS
 * ========================================
 */

let productosVenta = [];
let metodoPagoSeleccionado = null;

/**
 * Busca productos para agregar a la venta
 */
async function buscarProductos(termino) {
    if (!termino || termino.length < 1) {
        document.getElementById('resultados-busqueda').style.display = 'none';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/productos', {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al buscar productos');
        }

        const data = await response.json();
        const productos = data.productos || [];
        
        const terminoLower = termino.toLowerCase();
        const resultados = productos.filter(p => 
            p.codproducto.toLowerCase().includes(terminoLower) ||
            p.nombre.toLowerCase().includes(terminoLower)
        );

        mostrarResultadosBusqueda(resultados);
    } catch (error) {
        console.error('Error buscando productos:', error);
    }
}

/**
 * Muestra los resultados de búsqueda
 */
function mostrarResultadosBusqueda(resultados) {
    const contenedor = document.getElementById('resultados-busqueda');
    const listaResultados = document.getElementById('lista-resultados');

    if (resultados.length === 0) {
        contenedor.style.display = 'none';
        return;
    }

    listaResultados.innerHTML = resultados.map(prod => `
        <div class="resultado-item" onclick="agregarProductoVenta('${prod.codproducto}', '${prod.nombre}', ${prod.preciounitario})">
            <div class="resultado-info">
                <span class="resultado-nombre">${prod.nombre}</span>
                <span class="resultado-codigo">${prod.codproducto}</span>
            </div>
            <span class="resultado-precio">Bs. ${parseFloat(prod.preciounitario).toFixed(2)}</span>
        </div>
    `).join('');

    contenedor.style.display = 'block';
}

/**
 * Agrega un producto a la venta
 */
function agregarProductoVenta(codproducto, nombre, preciounitario) {
    // Buscar si el producto ya existe
    const productoExistente = productosVenta.find(p => p.codproducto === codproducto);

    if (productoExistente) {
        // Si existe, incrementar la cantidad
        productoExistente.cantidad++;
        productoExistente.subtotal = productoExistente.cantidad * productoExistente.preciounitario;
    } else {
        // Si no existe, agregarlo con cantidad 1
        productosVenta.push({
            codproducto,
            nombre,
            preciounitario: parseFloat(preciounitario),
            cantidad: 1,
            subtotal: parseFloat(preciounitario)
        });
    }

    // Limpiar búsqueda
    document.getElementById('buscar-producto').value = '';
    document.getElementById('resultados-busqueda').style.display = 'none';

    // Actualizar tabla y resumen
    mostrarProductosVenta();
    calcularResumen();
}

/**
 * Muestra los productos seleccionados en la tabla
 */
function mostrarProductosVenta() {
    const tbody = document.getElementById('productos-venta-lista');

    if (productosVenta.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No hay productos seleccionados</td></tr>';
        return;
    }

    tbody.innerHTML = productosVenta.map((prod, index) => `
        <tr>
            <td>${prod.codproducto}</td>
            <td>${prod.nombre}</td>
            <td>Bs. ${parseFloat(prod.preciounitario).toFixed(2)}</td>
            <td>
                <div style="display: flex; gap: 4px; align-items: center;">
                    <button class="btn-cantidad" onclick="cambiarCantidad(${index}, -1)">−</button>
                    <span style="width: 30px; text-align: center;">${prod.cantidad}</span>
                    <button class="btn-cantidad" onclick="cambiarCantidad(${index}, 1)">+</button>
                </div>
            </td>
            <td>Bs. ${parseFloat(prod.subtotal).toFixed(2)}</td>
            <td>
                <button class="btn-accion btn-eliminar" onclick="eliminarProductoVenta(${index})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

/**
 * Cambia la cantidad de un producto
 */
function cambiarCantidad(index, cambio) {
    const producto = productosVenta[index];
    const nuevaCantidad = producto.cantidad + cambio;

    if (nuevaCantidad <= 0) {
        eliminarProductoVenta(index);
    } else {
        producto.cantidad = nuevaCantidad;
        producto.subtotal = producto.cantidad * producto.preciounitario;
        mostrarProductosVenta();
        calcularResumen();
    }
}

/**
 * Elimina un producto de la venta
 */
function eliminarProductoVenta(index) {
    productosVenta.splice(index, 1);
    mostrarProductosVenta();
    calcularResumen();
}

/**
 * Calcula el resumen de la venta (subtotal = total)
 */
function calcularResumen() {
    const subtotal = productosVenta.reduce((sum, prod) => sum + prod.subtotal, 0);
    const total = subtotal;

    // Actualizar elementos del DOM
    document.getElementById('subtotal').textContent = `Bs. ${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `Bs. ${total.toFixed(2)}`;

    // Actualizar estado del botón finalizar
    actualizarEstadoBtnFinalizar();
}

/**
 * Actualiza el estado del botón finalizar
 */
function actualizarEstadoBtnFinalizar() {
    const btnFinalizar = document.getElementById('btn-finalizar');
    const hayCliente = clienteSeleccionadoVenta !== null && document.getElementById('cliente-seleccionado-id').value !== '';
    const hayProductos = productosVenta.length > 0;
    const hayMetodoPago = metodoPagoSeleccionado !== null;

    // El botón se habilita solo si hay cliente, productos y método de pago
    if (hayCliente && hayProductos && hayMetodoPago) {
        btnFinalizar.disabled = false;
        btnFinalizar.title = 'Click para finalizar la venta';
    } else {
        btnFinalizar.disabled = true;
        if (!hayCliente) {
            btnFinalizar.title = 'Primero debe seleccionar un cliente';
        } else if (!hayProductos) {
            btnFinalizar.title = 'Debe agregar al menos un producto';
        } else if (!hayMetodoPago) {
            btnFinalizar.title = 'Debe seleccionar un método de pago';
        }
    }
}

/**
 * Selecciona el método de pago
 */
function seleccionarMetodoPago(idmetodo) {
    metodoPagoSeleccionado = idmetodo;
    
    // Actualizar botones visuales
    document.querySelectorAll('.metodo-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-metodo="${idmetodo}"]`).classList.add('active');
    
    // Guardar en input hidden
    document.getElementById('metodo-pago-seleccionado').value = idmetodo;

    // Actualizar estado del botón finalizar
    actualizarEstadoBtnFinalizar();
}

async function finalizarVenta() {
    // Validar cliente (OBLIGATORIO)
    if (!clienteSeleccionadoVenta || !document.getElementById('cliente-seleccionado-id').value) {
        mostrarAlerta('❌ ERROR: Debe seleccionar un cliente antes de finalizar la venta', 'error');
        return;
    }

    if (productosVenta.length === 0) {
        mostrarAlerta('Debe agregar al menos un producto', 'error');
        return;
    }

    if (!metodoPagoSeleccionado) {
        mostrarAlerta('Debe seleccionar un método de pago', 'error');
        return;
    }

    const subtotal = productosVenta.reduce((sum, prod) => sum + prod.subtotal, 0);
    const total = subtotal;

    const datosVenta = {
        subtotal: subtotal,
        total: total,
        idmetodo: metodoPagoSeleccionado,
        ci_nit: clienteSeleccionadoVenta.ci_nit,
        detalles: productosVenta.map(prod => ({
            codproducto: prod.codproducto,
            cantidad: prod.cantidad,
            preciounitario: prod.preciounitario,
            subtotal: prod.subtotal
        }))
    };

    console.log('[FINALIZAR VENTA] Datos:', datosVenta);

    try {
        const response = await fetch('http://localhost:3000/api/ventas', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosVenta)
        });

        if (!response.ok) {
            throw new Error('Error al guardar la venta');
        }

        const data = await response.json();
        console.log('[FINALIZAR VENTA] Respuesta:', data);

        mostrarAlerta(`✓ Venta registrada exitosamente. ID: ${data.venta.idventa}`, 'success');
        
        // Limpiar venta
        productosVenta = [];
        metodoPagoSeleccionado = null;
        clienteSeleccionadoVenta = null;
        document.getElementById('buscar-cliente-ci').value = '';
        document.getElementById('cliente-seleccionado-id').value = '';
        document.getElementById('cliente-seleccionado').textContent = 'No hay cliente seleccionado';
        document.querySelector('.cliente-busqueda').style.display = 'flex';
        document.getElementById('cliente-info-contenedor').style.display = 'none';
        document.getElementById('buscar-producto').value = '';
        mostrarProductosVenta();
        calcularResumen();
        
        // Desabilitar sección de productos
        desabilitarSeccionProductos();

        // Recargar historial
        setTimeout(() => {
            cargarHistorialVentas();
        }, 500);

    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al registrar la venta', 'error');
    }
}

/**
 * Cancela la venta actual
 */
function cancelarVenta() {
    if (productosVenta.length === 0) {
        if (confirm('¿Está seguro de que desea volver? Perderá los productos agregados.')) {
            volverAtras();
        }
    } else if (confirm('¿Está seguro de que desea cancelar la venta? Se perderán todos los productos agregados.')) {
        productosVenta = [];
        metodoPagoSeleccionado = null;
        document.getElementById('buscar-producto').value = '';
        mostrarProductosVenta();
        calcularResumen();
        volverAtras();
    }
}

/**
 * Carga el historial de ventas
 */
async function cargarHistorialVentas() {
    console.log('[HISTORIAL] Cargando historial de ventas');
    try {
        const response = await fetch('http://localhost:3000/api/ventas', {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar historial');
        }

        const data = await response.json();
        console.log('[HISTORIAL] Datos recibidos:', data);
        mostrarHistorialVentas(data.ventas || []);
    } catch (error) {
        console.error('[HISTORIAL] Error:', error);
        mostrarAlerta('Error al cargar historial de ventas', 'error');
    }
}

/**
 * Muestra el historial de ventas en la tabla
 */
function mostrarHistorialVentas(ventas) {
    const tbody = document.getElementById('historial-ventas-lista');

    if (!ventas || ventas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center;">No hay ventas registradas</td></tr>';
        return;
    }

    tbody.innerHTML = ventas.map(venta => {
        const fecha = new Date(venta.fecharegistro).toLocaleString('es-BO');
        const metodoClass = venta.idmetodo === 1 ? 'efectivo' : venta.idmetodo === 2 ? 'tarjeta' : 'tarjeta';
        
        return `
            <tr>
                <td>${venta.idventa}</td>
                <td>${fecha}</td>
                <td>${venta.nombre1} ${venta.apellido1 || ''}</td>
                <td>${venta.cantidad_productos} producto(s)</td>
                <td><strong>Bs. ${parseFloat(venta.total).toFixed(2)}</strong></td>
                <td><span class="metodo-pago-badge ${metodoClass}">${venta.metodo}</span></td>
            </tr>
        `;
    }).join('');
}

/**
 * Carga datos cuando cambia de sección (override parcial de cambiarSeccion)
 */
const cambiarSeccionOriginal = window.cambiarSeccion;
window.cambiarSeccion = function(section) {
    cambiarSeccionOriginal.call(this, section);
    
    if (section === 'historial') {
        cargarHistorialVentas();
    } else if (section === 'ventas') {
        productosVenta = [];
        metodoPagoSeleccionado = null;
        document.getElementById('buscar-producto').value = '';
        mostrarProductosVenta();
        calcularResumen();
    } else if (section === 'clientes') {
        cargarClientes();
    }
};

/**
 * ========================================
 * MÓDULO DE CLIENTES
 * ========================================
 */

let clienteSeleccionadoVenta = null;

/**
 * Busca un cliente por C.I. durante la venta
 */
async function buscarClientePorCI() {
    const ci = document.getElementById('buscar-cliente-ci').value.trim();
    
    if (!ci) {
        mostrarAlerta('Por favor ingrese un C.I./NIT', 'error');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/clientes/${ci}`, {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });

        if (response.ok) {
            // Cliente encontrado
            const data = await response.json();
            clienteSeleccionadoVenta = data.cliente;
            mostrarClienteSeleccionado(data.cliente);
            mostrarAlerta('Cliente encontrado', 'success');
            habilitarSeccionProductos();
        } else {
            // Cliente no encontrado, preguntar si crear uno nuevo
            mostrarAlerta('Cliente no encontrado. Se abrirá el formulario para crear uno nuevo.', 'info');
            abrirFormularioCrearClienteVenta(ci);
        }
    } catch (error) {
        console.error('[CLIENTES] Error buscando cliente:', error);
        mostrarAlerta('Error al buscar cliente', 'error');
    }
}

/**
 * Habilita la sección de productos
 */
function habilitarSeccionProductos() {
    const seccionProductos = document.getElementById('seccion-productos');
    seccionProductos.style.opacity = '1';
    seccionProductos.style.pointerEvents = 'auto';
    
    const inputBuscar = document.getElementById('buscar-producto');
    inputBuscar.disabled = false;
}

/**
 * Desabilita la sección de productos
 */
function desabilitarSeccionProductos() {
    const seccionProductos = document.getElementById('seccion-productos');
    seccionProductos.style.opacity = '0.5';
    seccionProductos.style.pointerEvents = 'none';
    
    const inputBuscar = document.getElementById('buscar-producto');
    inputBuscar.disabled = true;
}

/**
 * Muestra el cliente seleccionado en la venta
 */
function mostrarClienteSeleccionado(cliente) {
    document.getElementById('cliente-seleccionado-id').value = cliente.ci_nit;
    document.getElementById('cliente-seleccionado').textContent = 
        `✓ ${cliente.nombre} ${cliente.apellido} (C.I.: ${cliente.ci_nit})`;
    
    const contenedor = document.getElementById('cliente-info-contenedor');
    contenedor.style.display = 'block';
    
    // Ocultar input de búsqueda
    document.querySelector('.cliente-busqueda').style.display = 'none';
    
    // Actualizar estado del botón finalizar
    actualizarEstadoBtnFinalizar();
}

/**
 * Limpia la selección de cliente en la venta
 */
function limpiarClienteVenta() {
    clienteSeleccionadoVenta = null;
    document.getElementById('cliente-seleccionado-id').value = '';
    document.getElementById('buscar-cliente-ci').value = '';
    document.querySelector('.cliente-busqueda').style.display = 'flex';
    document.getElementById('cliente-info-contenedor').style.display = 'none';
    document.getElementById('cliente-seleccionado').textContent = 'No hay cliente seleccionado';
    
    // Desabilitar sección de productos
    desabilitarSeccionProductos();
    
    // Limpiar productos
    productosVenta = [];
    metodoPagoSeleccionado = null;
    mostrarProductosVenta();
    calcularResumen();
    
    // Actualizar estado del botón finalizar
    actualizarEstadoBtnFinalizar();
}

/**
 * Abre el formulario para crear un cliente en la venta
 */
function abrirFormularioCrearClienteVenta(ci = '') {
    document.getElementById('modal-cliente').classList.add('active');
    document.getElementById('modal-cliente').style.display = 'flex';
    document.getElementById('modal-cliente-titulo').textContent = 'Registrar Nuevo Cliente';
    
    // Pre-llenar C.I. si viene desde búsqueda
    document.getElementById('f-ci').value = ci;
    document.getElementById('f-nombre').value = '';
    document.getElementById('f-apellido').value = '';
    document.getElementById('f-correo').value = '';
    
    const form = document.getElementById('form-cliente');
    form.onsubmit = null;
    form.removeEventListener('submit', form.onsubmit);
    form.addEventListener('submit', handleCrearClienteVenta);
}

/**
 * Carga la lista de clientes
 */
async function cargarClientes() {
    console.log('[CLIENTES] Cargando lista de clientes');
    try {
        const response = await fetch('http://localhost:3000/api/clientes', {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar clientes');
        }

        const data = await response.json();
        console.log('[CLIENTES] Datos recibidos:', data);
        mostrarClientes(data.clientes || []);
    } catch (error) {
        console.error('[CLIENTES] Error:', error);
        mostrarAlerta('Error al cargar clientes', 'error');
    }
}

/**
 * Muestra la lista de clientes en la tabla
 * @param {Array} clientes - Lista de clientes
 */
function mostrarClientes(clientes) {
    const tbody = document.getElementById('clientes-lista');
    
    if (!clientes || clientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay clientes registrados</td></tr>';
        return;
    }

    tbody.innerHTML = clientes.map(cliente => {
        const fechaRegistro = new Date(cliente.fecharegistro).toLocaleDateString('es-ES');
        const badgeEstado = cliente.estado === 1 ? 'badge-activo' : 'badge-inactivo';
        const estadoTexto = cliente.estado === 1 ? 'Activo' : 'Inactivo';

        return `
            <tr>
                <td>${cliente.ci_nit}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.correo || '-'}</td>
                <td>${fechaRegistro}</td>
                <td><span class="badge ${badgeEstado}">${estadoTexto}</span></td>
                <td>
                    <div class="acciones-tabla">
                        <button class="btn-accion btn-editar" onclick="editarCliente(${cliente.ci_nit}, '${cliente.nombre}', '${cliente.apellido}', '${cliente.correo || ''}')">Editar</button>
                        <button class="btn-accion btn-eliminar" onclick="eliminarCliente(${cliente.ci_nit})">Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Abre el formulario para crear un nuevo cliente desde la sección Clientes
 */
function abrirFormularioCliente() {
    cambiarSeccion('clientes');
    document.getElementById('modal-cliente').classList.add('active');
    document.getElementById('modal-cliente').style.display = 'flex';
    document.getElementById('modal-cliente-titulo').textContent = 'Nuevo Cliente';
    
    // Limpiar campos
    document.getElementById('f-ci').value = '';
    document.getElementById('f-nombre').value = '';
    document.getElementById('f-apellido').value = '';
    document.getElementById('f-correo').value = '';
    
    // Asegurar que el handler es el correcto para crear
    const form = document.getElementById('form-cliente');
    form.onsubmit = null;
    form.removeEventListener('submit', form.onsubmit);
    form.addEventListener('submit', handleCrearCliente);
}

/**
 * Cierra el modal de cliente
 */
function cerrarModalCliente() {
    document.getElementById('modal-cliente').classList.remove('active');
    document.getElementById('modal-cliente').style.display = 'none';
    
    // Limpiar campos
    document.getElementById('form-cliente').reset();
}

/**
 * Maneja la creación de un cliente desde la sección Clientes
 */
async function handleCrearCliente(e) {
    e.preventDefault();

    const ci = document.getElementById('f-ci').value;
    const nombre = document.getElementById('f-nombre').value;
    const apellido = document.getElementById('f-apellido').value;
    const correo = document.getElementById('f-correo').value;

    if (!ci || !nombre || !apellido) {
        mostrarAlerta('Por favor complete todos los campos requeridos', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
            },
            body: JSON.stringify({
                ci_nit: parseInt(ci),
                nombre,
                apellido,
                correo: correo || null
            })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Error al crear cliente');
        }

        mostrarAlerta('Cliente registrado exitosamente', 'success');
        cerrarModalCliente();
        cargarClientes();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta(error.message || 'Error al registrar cliente', 'error');
    }
}

/**
 * Maneja la creación de un cliente desde la venta
 */
async function handleCrearClienteVenta(e) {
    e.preventDefault();

    const ci = document.getElementById('f-ci').value;
    const nombre = document.getElementById('f-nombre').value;
    const apellido = document.getElementById('f-apellido').value;
    const correo = document.getElementById('f-correo').value;

    if (!ci || !nombre || !apellido) {
        mostrarAlerta('Por favor complete todos los campos requeridos', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
            },
            body: JSON.stringify({
                ci_nit: parseInt(ci),
                nombre,
                apellido,
                correo: correo || null
            })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Error al crear cliente');
        }

        const data = await response.json();
        
        // Seleccionar el cliente en la venta
        clienteSeleccionadoVenta = data.cliente;
        mostrarClienteSeleccionado(data.cliente);
        habilitarSeccionProductos();

        mostrarAlerta('Cliente registrado exitosamente', 'success');
        cerrarModalCliente();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta(error.message || 'Error al registrar cliente', 'error');
    }
}

/**
 * Edita un cliente
 */
function editarCliente(ci_nit, nombre, apellido, correo) {
    document.getElementById('modal-cliente').classList.add('active');
    document.getElementById('modal-cliente').style.display = 'flex';
    document.getElementById('modal-cliente-titulo').textContent = 'Editar Cliente';
    
    document.getElementById('f-ci').value = ci_nit;
    document.getElementById('f-ci').disabled = true; // No permitir cambiar el C.I.
    document.getElementById('f-nombre').value = nombre;
    document.getElementById('f-apellido').value = apellido;
    document.getElementById('f-correo').value = correo;
    
    // Crear un nuevo form submit handler para edición
    const form = document.getElementById('form-cliente');
    const handleEdicion = async (e) => {
        e.preventDefault();
        await handleActualizarCliente(ci_nit);
        // Eliminar este handler después de usar
        form.removeEventListener('submit', handleEdicion);
        // Restaurar el handler original para crear
        form.addEventListener('submit', handleCrearCliente);
    };
    
    // Remover listeners anteriores
    form.removeEventListener('submit', handleCrearCliente);
    form.addEventListener('submit', handleEdicion);
}

/**
 * Maneja la actualización de un cliente
 */
async function handleActualizarCliente(ci_nit) {
    const nombre = document.getElementById('f-nombre').value;
    const apellido = document.getElementById('f-apellido').value;
    const correo = document.getElementById('f-correo').value;

    if (!nombre || !apellido) {
        mostrarAlerta('Por favor complete todos los campos', 'error');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/clientes/${ci_nit}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
            },
            body: JSON.stringify({
                nombre,
                apellido,
                correo: correo || null
            })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar cliente');
        }

        mostrarAlerta('Cliente actualizado exitosamente', 'success');
        
        // Restaurar handler original
        const form = document.getElementById('form-cliente');
        form.onsubmit = null;
        form.removeEventListener('submit', form.onsubmit);
        form.addEventListener('submit', handleCrearCliente);
        
        // Re-habilitar C.I.
        document.getElementById('f-ci').disabled = false;
        
        cerrarModalCliente();
        cargarClientes();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al actualizar cliente', 'error');
    }
}

/**
 * Elimina un cliente
 */
async function eliminarCliente(ci_nit) {
    if (!confirm('¿Está seguro de que desea eliminar este cliente?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/clientes/${ci_nit}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar cliente');
        }

        mostrarAlerta('Cliente eliminado exitosamente', 'success');
        cargarClientes();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al eliminar cliente', 'error');
    }
}

/**
 * ========================================
 * MÓDULO DE RESPALDO
 * ========================================
 */

/**
 * Crea una copia de seguridad de la base de datos
 */
async function crearRespaldo() {
    const btnRespaldo = document.querySelector('[onclick="crearRespaldo()"]');
    
    // Mostrar estado de carga
    const textoOriginal = btnRespaldo.textContent;
    btnRespaldo.disabled = true;
    btnRespaldo.textContent = '⏳ Creando copia de seguridad...';
    
    try {
        const response = await fetch('http://localhost:3000/api/respaldo', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Error al crear respaldo');
        }

        // Descargar el archivo
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Nombre del archivo con fecha y hora
        const ahora = new Date();
        const fecha = ahora.toISOString().replace(/[:.]/g, '-').slice(0, -5);
        a.download = `kirkmark-backup-${fecha}.sql`;
        
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Mostrar mensaje de éxito
        mostrarAlerta('✓ Copia de seguridad creada exitosamente', 'success');
        
        // Mostrar información del respaldo
        const respaldoInfo = document.getElementById('respaldo-info');
        const respaldoFecha = document.getElementById('respaldo-fecha');
        
        respaldoFecha.textContent = `Última copia de seguridad: ${ahora.toLocaleString('es-BO')}`;
        respaldoInfo.style.display = 'block';

    } catch (error) {
        console.error('[RESPALDO] Error:', error);
        mostrarAlerta(`Error al crear respaldo: ${error.message}`, 'error');
    } finally {
        // Restaurar botón
        btnRespaldo.disabled = false;
        btnRespaldo.textContent = textoOriginal;
    }
}

