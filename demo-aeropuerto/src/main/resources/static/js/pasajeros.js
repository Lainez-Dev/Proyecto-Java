// Variables globales
let pasajeros = [];

// Función para buscar pasajeros
function buscarPasajeros() {
    let dni = document.getElementById('dni').value.trim();
    
    // Si está vacío, usar "*" para obtener todos
    if (dni === '') {
        dni = '*';
    }
    
    fetch("http://localhost:9999/consulta_pasajeros?dni=" + encodeURIComponent(dni), {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then(res => res.text())
    .then(json => {
        const posts = JSON.parse(json);
        mostrarPasajeros(posts);
    })
    .catch(e => {
        console.log('Error importando archivo: ' + e.message);
        mostrarError('Error al buscar pasajeros: ' + e.message);
    });
}

// Función para mostrar pasajeros en la tabla
function mostrarPasajeros(posts) {
    let tabla = "";
    
    if (posts.length === 0) {
        tabla = `<tr>
            <td colspan="7" class="empty-state">
                <i class="fas fa-users"></i>
                <h3>No se encontraron pasajeros</h3>
                <p>No hay pasajeros que coincidan con los criterios de búsqueda.</p>
            </td>
        </tr>`;
    } else {
        posts.forEach(fila => {
            tabla += "<tr>";
            tabla += "<td>" + fila.id + "</td>";
            tabla += "<td>" + fila.nombre + "</td>";
            tabla += "<td>" + fila.apellido + "</td>";
            tabla += "<td>" + fila.dni + "</td>";
            tabla += "<td>" + fila.fechaNacimiento + "</td>";   
            tabla += "<td>" + fila.email + "</td>";
            tabla += `<td class="table-actions">
                <button class="btn btn-sm" onclick="llamarModificarPasajero('${fila.id}', '${fila.nombre}', '${fila.apellido}', '${fila.dni}', '${fila.fechaNacimiento}', '${fila.email}')">
                    <i class="fas fa-edit"></i> Modificar
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarPasajero('${fila.dni}')">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>`;
            tabla += "</tr>";
        });
    }
    
    var contenedor_tabla = document.getElementById("contenido_tabla");
    contenedor_tabla.innerHTML = tabla;
    pasajeros = posts;
}

// Función para eliminar pasajero
function eliminarPasajero(dni) {
    if (!confirm('¿Está seguro de que desea eliminar este pasajero?')) {
        return;
    }

    fetch('http://localhost:9999/borrar_pasajero?dni=' + dni, {
        method: 'DELETE',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then(res => res.text())
    .then(json => {
        mostrarExito('Pasajero eliminado correctamente');
        buscarPasajeros();
        cerrarDialogo();
    })
    .catch(e => {
        console.log('Error eliminando Pasajero: ' + e.message);
        mostrarError('Error al eliminar pasajero: ' + e.message);
    });
}

// Función para editar pasajero
function edicionPasajero() {
    let id = document.getElementById('idPasajero').value;
    let nombre = document.getElementById('nombreEdicion').value;
    let apellido = document.getElementById('apellidoEdicion').value;
    let fecha = document.getElementById('fechaNacimientoEdicion').value;
    let dni = document.getElementById('dniEdicion').value;
    let email = document.getElementById('emailEdicion').value;

    if (!validarFormulario(nombre, apellido, dni, fecha, email)) {
        return;
    }

    fetch('http://localhost:9999/editar_pasajero?id='+id+'&nombre='+encodeURIComponent(nombre)+'&apellido='+encodeURIComponent(apellido)+'&dni='+encodeURIComponent(dni)+'&fechaNacimiento='+fecha+'&email='+encodeURIComponent(email), {
        method: 'PUT',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then(res => res.text())
    .then(json => {
        mostrarExito('Pasajero modificado correctamente');
        buscarPasajeros();
        cerrarDialogo();
    })
    .catch(e => {
        console.log('Error modificando Pasajero: ' + e.message);
        mostrarError('Error al modificar pasajero: ' + e.message);
    });
}

// Función para abrir dialog de creación
function llamarDialogoPasajero() {
    const dialogoPasajero = document.getElementById('dialogoPasajero');
    if (dialogoPasajero) {
        // Limpiar formulario
        document.getElementById('nombreCreacion').value = '';
        document.getElementById('apellidoCreacion').value = '';
        document.getElementById('fechaNacimientoCreacion').value = '';
        document.getElementById('dniCreacion').value = '';
        document.getElementById('emailCreacion').value = '';
        dialogoPasajero.showModal();
    }
}

// Función para crear pasajero
function crearPasajero() {
    let nombre = document.getElementById('nombreCreacion').value;
    let apellido = document.getElementById('apellidoCreacion').value;
    let fechaNacimiento = document.getElementById('fechaNacimientoCreacion').value;
    let dni = document.getElementById('dniCreacion').value;
    let email = document.getElementById('emailCreacion').value;
    
    if (!validarFormulario(nombre, apellido, dni, fechaNacimiento, email)) {
        return;
    }
    
    fetch('http://localhost:9999/crear_pasajero?nombre='+ encodeURIComponent(nombre) +'&apellido='+ encodeURIComponent(apellido) +'&dni='+ encodeURIComponent(dni) +'&fechaNacimiento='+ fechaNacimiento +'&email=' + encodeURIComponent(email), {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then(res => res.text())
    .then(json => {
        mostrarExito('Pasajero creado correctamente');
        buscarPasajeros();
        cerrarDialogo();
    })
    .catch(e => {
        console.log('Error creando Pasajero: ' + e.message);
        mostrarError('Error al crear pasajero: ' + e.message);
    });
}

// Función para abrir dialog de edición
function llamarModificarPasajero(id, nombre, apellido, dni, fechaNacimiento, email) {
    document.getElementById('idPasajero').value = id;
    document.getElementById('nombreEdicion').value = nombre;
    document.getElementById('apellidoEdicion').value = apellido;
    document.getElementById('dniEdicion').value = dni;
    document.getElementById('fechaNacimientoEdicion').value = fechaNacimiento;
    document.getElementById('emailEdicion').value = email;
    
    const dialogoPasajeroEdicion = document.getElementById('dialogoPasajeroEdicion');
    if (dialogoPasajeroEdicion) {
        dialogoPasajeroEdicion.showModal();
    }
}

// Función para cerrar dialogs
function cerrarDialogo() {
    const dialogoPasajero = document.getElementById('dialogoPasajero');
    const dialogoPasajeroEdicion = document.getElementById('dialogoPasajeroEdicion');
    
    if (dialogoPasajero) {
        dialogoPasajero.close();
    }
    if (dialogoPasajeroEdicion) {
        dialogoPasajeroEdicion.close();
    }
}

// Función de carga inicial
function cargaInicial() {
    fetch("http://localhost:9999/consulta_pasajeros?dni=*", {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then(res => res.text())
    .then(json => {
        const posts = JSON.parse(json);
        mostrarPasajeros(posts);
    })
    .catch(e => {
        console.log('Error importando archivo: ' + e.message);
        mostrarError('Error al cargar pasajeros: ' + e.message);
    });
}

// Función para validar formulario
function validarFormulario(nombre, apellido, dni, fecha, email) {
    if (!nombre.trim()) {
        mostrarError('El nombre es obligatorio');
        return false;
    }
    if (!apellido.trim()) {
        mostrarError('El apellido es obligatorio');
        return false;
    }
    if (!dni.trim()) {
        mostrarError('El DNI es obligatorio');
        return false;
    }
    if (!fecha) {
        mostrarError('La fecha de nacimiento es obligatoria');
        return false;
    }
    if (!email.trim()) {
        mostrarError('El email es obligatorio');
        return false;
    }
    if (!isValidEmail(email)) {
        mostrarError('El formato del email no es válido');
        return false;
    }
    return true;
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para mostrar mensajes de éxito
function mostrarExito(mensaje) {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `
        <div class="alert alert-success show">
            <i class="fas fa-check-circle"></i> ${mensaje}
        </div>
    `;
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

// Función para mostrar mensajes de error
function mostrarError(mensaje) {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `
        <div class="alert alert-error show">
            <i class="fas fa-exclamation-circle"></i> ${mensaje}
        </div>
    `;
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

// Función para formatear fecha (opcional)
function formatearFecha(fecha) {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES');
}

// Función para limpiar formularios
function limpiarFormularioCreacion() {
    document.getElementById('nombreCreacion').value = '';
    document.getElementById('apellidoCreacion').value = '';
    document.getElementById('fechaNacimientoCreacion').value = '';
    document.getElementById('dniCreacion').value = '';
    document.getElementById('emailCreacion').value = '';
}

function limpiarFormularioEdicion() {
    document.getElementById('idPasajero').value = '';
    document.getElementById('nombreEdicion').value = '';
    document.getElementById('apellidoEdicion').value = '';
    document.getElementById('fechaNacimientoEdicion').value = '';
    document.getElementById('dniEdicion').value = '';
    document.getElementById('emailEdicion').value = '';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Cargar todos los pasajeros al iniciar
    buscarPasajeros();
    
    // Event listener para búsqueda con Enter
    document.getElementById('dni').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarPasajeros();
        }
    });
    
    // Event listener para limpiar y mostrar todos cuando se borra el contenido
    document.getElementById('dni').addEventListener('input', function(e) {
        const dni = e.target.value.trim();
        // Solo buscar automáticamente si el campo está completamente vacío
        if (dni === '') {
            buscarPasajeros();
        }
    });
    
    // Cerrar dialogs al hacer clic fuera de ellos
    document.getElementById('dialogoPasajero').addEventListener('click', function(e) {
        if (e.target === this) {
            cerrarDialogo();
        }
    });

    document.getElementById('dialogoPasajeroEdicion').addEventListener('click', function(e) {
        if (e.target === this) {
            cerrarDialogo();
        }
    });
    
    // Validación en tiempo real para los formularios
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validarCampo(this);
        });
    });
});

// Función para validar campos individuales
function validarCampo(campo) {
    const valor = campo.value.trim();
    const tipo = campo.type;
    
    // Remover clases de validación previas
    campo.classList.remove('is-valid', 'is-invalid');
    
    if (campo.hasAttribute('required') && !valor) {
        campo.classList.add('is-invalid');
        return false;
    }
    
    if (tipo === 'email' && valor && !isValidEmail(valor)) {
        campo.classList.add('is-invalid');
        return false;
    }
    
    if (valor) {
        campo.classList.add('is-valid');
    }
    
    return true;
}

// Función para exportar datos (opcional)
function exportarPasajeros() {
    if (pasajeros.length === 0) {
        mostrarError('No hay datos para exportar');
        return;
    }
    
    let csv = 'ID,Nombre,Apellido,DNI,Fecha Nacimiento,Email\n';
    pasajeros.forEach(pasajero => {
        csv += `${pasajero.id},"${pasajero.nombre}","${pasajero.apellido}","${pasajero.dni}","${pasajero.fechaNacimiento}","${pasajero.email}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pasajeros.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    mostrarExito('Datos exportados correctamente');
}

// Función para estadísticas básicas (opcional)
function mostrarEstadisticas() {
    const totalPasajeros = pasajeros.length;
    const dominiosEmail = {};
    
    pasajeros.forEach(pasajero => {
        if (pasajero.email) {
            const dominio = pasajero.email.split('@')[1];
            dominiosEmail[dominio] = (dominiosEmail[dominio] || 0) + 1;
        }
    });
    
    console.log(`Total de pasajeros: ${totalPasajeros}`);
    console.log('Dominios de email más comunes:', dominiosEmail);
}