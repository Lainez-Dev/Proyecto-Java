// Variables globales
let aerolineas = [];
let paisesDisponibles = new Set();

function buscarAerolineas() {
    let nombre = document.getElementById('nombre').value || '*';
    let paisFiltro = document.getElementById('paisFiltro').value || '*';
    
    // Construir parámetros de búsqueda
    let parametros = `nombre=${encodeURIComponent(nombre)}`;
    if (paisFiltro !== '*' && paisFiltro !== '') {
        parametros += `&pais=${encodeURIComponent(paisFiltro)}`;
    }
    
    fetch(`http://localhost:9999/consulta_aerolineas?${parametros}`, {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then(res => res.text())
    .then(json => {
        const aerolineasData = JSON.parse(json);
        mostrarAerolineas(aerolineasData);
    })
    .catch(e => {
        console.log('Error buscando aerolíneas: ' + e.message);
        mostrarError('Error al buscar aerolíneas');
    });
}

function cargarAerolineas() {
    fetch("http://localhost:9999/consulta_aerolineas?nombre=*", {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then(res => res.text())
    .then(json => {
        const aerolineasData = JSON.parse(json);
        aerolineas = aerolineasData;
        mostrarAerolineas(aerolineasData);
        actualizarEstadisticas(aerolineasData);
        actualizarPaisesDisponibles(aerolineasData);
    })
    .catch(e => {
        console.log('Error cargando aerolíneas: ' + e.message);
        mostrarError('Error al cargar aerolíneas');
    });
}

function mostrarAerolineas(aerolineasData) {
    let tabla = "";
    if (aerolineasData && aerolineasData.length > 0) {
        aerolineasData.forEach(aerolinea => {
            // Simular datos de flota y estado
            const flota = Math.floor(Math.random() * 50) + 5; // Entre 5 y 54 aviones
            const estado = Math.random() > 0.1 ? 'activa' : (Math.random() > 0.5 ? 'suspendida' : 'inactiva');
            const estadoTexto = {
                'activa': 'Activa',
                'suspendida': 'Suspendida',
                'inactiva': 'Inactiva'
            };
            
            // Generar iniciales para el logo
            const iniciales = aerolinea.nombre.split(' ')
                .map(palabra => palabra.charAt(0))
                .slice(0, 2)
                .join('');
            
            tabla += "<tr onclick=\"mostrarDetallesAerolinea(" + aerolinea.id + ")\" style=\"cursor: pointer;\">";
            tabla += "<td>" + aerolinea.id + "</td>";
            tabla += "<td>";
            tabla += "<div class='airline-name'>";
            tabla += "<div class='airline-logo'>" + iniciales + "</div>";
            tabla += "<span>" + aerolinea.nombre + "</span>";
            tabla += "</div>";
            tabla += "</td>";
            tabla += "<td>";
            tabla += "<span class='country-flag' data-country='" + aerolinea.paisOrigen + "'>" + aerolinea.paisOrigen + "</span>";
            tabla += "</td>";
            tabla += "<td>";
            tabla += "<div class='fleet-info'>";
            tabla += "<i class='fas fa-fighter-jet'></i>";
            tabla += "<span>" + flota + " aeronaves</span>";
            tabla += "</div>";
            tabla += "</td>";
            tabla += "<td><span class='airline-status status-" + estado + "'>" + estadoTexto[estado] + "</span></td>";
            tabla += "<td class='table-actions' onclick='event.stopPropagation()'>";
            tabla += "<button class='btn btn-warning btn-sm' onclick=\"llamarModificarAerolinea('" + aerolinea.id + "', '" + aerolinea.nombre + "', '" + aerolinea.paisOrigen + "')\"><i class='fas fa-edit'></i> Modificar</button>";
            tabla += "<button class='btn btn-danger btn-sm' onclick=\"eliminarAerolinea(" + aerolinea.id + ")\"><i class='fas fa-trash'></i> Eliminar</button>";
            tabla += "</td>";
            tabla += "</tr>";
        });
    } else {
        tabla = "<tr><td colspan='6' class='empty-state'><i class='fas fa-building'></i><h3>No hay aerolíneas registradas</h3><p>Comience agregando una nueva aerolínea</p></td></tr>";
    }
    
    var contenedor_tabla = document.getElementById("contenido_tabla");
    contenedor_tabla.innerHTML = tabla;
}

function eliminarAerolinea(id) {
    if (confirm('¿Está seguro de que desea eliminar esta aerolínea? Esta acción también eliminará todos los aviones asociados.')) {
        fetch('http://localhost:9999/borrar_aerolinea?id=' + id, {
            method: 'DELETE'
        })
        .then(res => res.text())
        .then(json => {
            cargarAerolineas();
            cerrarDialogo();
            mostrarExito('Aerolínea eliminada correctamente');
        })
        .catch(e => {
            console.log('Error eliminando aerolínea: ' + e.message);
            mostrarError('Error al eliminar aerolínea');
        });
    }
}

// Función para verificar si existe una aerolínea con el mismo nombre
async function verificarAerolineaExistente(nombre) {
    try {
        const response = await fetch(`http://localhost:9999/verificar_aerolinea?nombre=${encodeURIComponent(nombre)}`);
        const data = await response.json();
        return data.existe;
    } catch (e) {
        console.log('Error verificando aerolínea: ' + e.message);
        return false;
    }
}

// Función para verificar aerolínea en edición
async function verificarAerolineaEdicion(nombre, id) {
    try {
        const response = await fetch(`http://localhost:9999/verificar_aerolinea_edicion?nombre=${encodeURIComponent(nombre)}&id=${id}`);
        const data = await response.json();
        return data.existe;
    } catch (e) {
        console.log('Error verificando aerolínea para edición: ' + e.message);
        return false;
    }
}

async function edicionAerolinea() {
    let id = document.getElementById('idAerolinea').value;
    let nombre = document.getElementById('nombreEdicion').value.trim();
    let paisOrigen = document.getElementById('paisOrigenEdicion').value.trim();

    if (!nombre || !paisOrigen) {
        mostrarError('Por favor complete todos los campos');
        return;
    }

    // Verificar si ya existe otra aerolínea con ese nombre
    const existe = await verificarAerolineaEdicion(nombre, id);
    if (existe) {
        mostrarError(`Ya existe otra aerolínea con el nombre: ${nombre}`);
        return;
    }

    fetch(`http://localhost:9999/editar_aerolinea?id=${id}&nombre=${encodeURIComponent(nombre)}&paisOrigen=${encodeURIComponent(paisOrigen)}`, {
        method: 'PUT'
    })
    .then(res => {
        if (res.ok) {
            return res.text();
        } else {
            return res.text().then(text => Promise.reject(text));
        }
    })
    .then(json => {
        cargarAerolineas();
        cerrarDialogo();
        mostrarExito('Aerolínea modificada correctamente');
    })
    .catch(e => {
        console.log('Error modificando aerolínea: ' + e);
        mostrarError('Error al modificar aerolínea: ' + e);
    });
}

function llamarDialogoAerolinea() {
    const dialogoAerolinea = document.getElementById('dialogoAerolinea');
    if (dialogoAerolinea) {
        // Limpiar campos
        document.getElementById('nombreCreacion').value = '';
        document.getElementById('paisOrigenCreacion').value = '';
        dialogoAerolinea.showModal();
    }
}

function llamarModificarAerolinea(id, nombre, paisOrigen) {
    const dialogoAerolineaEdicion = document.getElementById('dialogoAerolineaEdicion');
    if (dialogoAerolineaEdicion) {
        // Llenar campos con datos existentes
        document.getElementById('idAerolinea').value = id;
        document.getElementById('nombreEdicion').value = nombre;
        document.getElementById('paisOrigenEdicion').value = paisOrigen;
        dialogoAerolineaEdicion.showModal();
    }
}

async function crearAerolinea() {
    let nombre = document.getElementById('nombreCreacion').value.trim();
    let paisOrigen = document.getElementById('paisOrigenCreacion').value.trim();
    
    if (!nombre || !paisOrigen) {
        mostrarError('Por favor complete todos los campos');
        return;
    }

    // Verificar si ya existe una aerolínea con ese nombre
    const existe = await verificarAerolineaExistente(nombre);
    if (existe) {
        mostrarError(`Ya existe una aerolínea con el nombre: ${nombre}`);
        return;
    }
    
    fetch(`http://localhost:9999/crear_aerolinea?nombre=${encodeURIComponent(nombre)}&paisOrigen=${encodeURIComponent(paisOrigen)}`)
    .then(res => {
        if (res.ok) {
            return res.text();
        } else {
            return res.text().then(text => Promise.reject(text));
        }
    })
    .then(json => {
        cargarAerolineas();
        cerrarDialogo();
        mostrarExito('Aerolínea creada correctamente');
    })
    .catch(e => {
        console.log('Error creando aerolínea: ' + e);
        mostrarError('Error al crear aerolínea: ' + e);
    });
}

function cerrarDialogo() {
    const dialogoAerolinea = document.getElementById('dialogoAerolinea');
    const dialogoAerolineaEdicion = document.getElementById('dialogoAerolineaEdicion');
    
    if (dialogoAerolinea) {
        dialogoAerolinea.close();
    }
    if (dialogoAerolineaEdicion) {
        dialogoAerolineaEdicion.close();
    }
}

function actualizarEstadisticas(aerolineasData) {
    const totalAerolineas = aerolineasData.length;
    
    // Calcular países únicos
    const paisesUnicos = new Set(aerolineasData.map(a => a.paisOrigen)).size;
    
    // Simular aerolíneas con flota (80% del total)
    const aerolineasConFlota = Math.ceil(totalAerolineas * 0.8);
    
    // Simular aerolíneas activas (90% del total)
    const aerolineasActivas = Math.ceil(totalAerolineas * 0.9);
    
    document.getElementById('totalAerolineas').textContent = totalAerolineas;
    document.getElementById('paisesUnicos').textContent = paisesUnicos;
    document.getElementById('aerolineasConFlota').textContent = aerolineasConFlota;
    document.getElementById('aerolineasActivas').textContent = aerolineasActivas;
}

function actualizarPaisesDisponibles(aerolineasData) {
    paisesDisponibles.clear();
    aerolineasData.forEach(aerolinea => {
        paisesDisponibles.add(aerolinea.paisOrigen);
    });
}

function cargarPaisesParaFiltros() {
    // Esta función se llama después de cargar las aerolíneas
    // para poblar el select de filtros con los países disponibles
    setTimeout(() => {
        const selectPais = document.getElementById('paisFiltro');
        if (selectPais && paisesDisponibles.size > 0) {
            let opciones = '<option value="">Todos los países</option>';
            Array.from(paisesDisponibles).sort().forEach(pais => {
                opciones += `<option value="${pais}">${pais}</option>`;
            });
            selectPais.innerHTML = opciones;
        }
    }, 500);
}

// Función para mostrar detalles de la aerolínea
function mostrarDetallesAerolinea(id) {
    const aerolinea = aerolineas.find(a => a.id === id);
    if (!aerolinea) return;
    
    const panel = document.getElementById('airlineDetails');
    const contenido = document.getElementById('detailsContent');
    
    // Simular datos adicionales
    const flota = Math.floor(Math.random() * 50) + 5;
    const fundacion = Math.floor(Math.random() * 50) + 1970;
    const destinos = Math.floor(Math.random() * 100) + 20;
    const pasajerosAnuales = (Math.random() * 50 + 10).toFixed(1);
    
    contenido.innerHTML = `
        <div class="detail-item">
            <div class="detail-label">Nombre Completo</div>
            <div class="detail-value">${aerolinea.nombre}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">País de Origen</div>
            <div class="detail-value">
                <span class="country-flag" data-country="${aerolinea.paisOrigen}">${aerolinea.paisOrigen}</span>
            </div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Año de Fundación</div>
            <div class="detail-value">${fundacion}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Tamaño de Flota</div>
            <div class="detail-value">${flota} aeronaves</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Destinos</div>
            <div class="detail-value">${destinos} ciudades</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Pasajeros Anuales</div>
            <div class="detail-value">${pasajerosAnuales} millones</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Estado Operacional</div>
            <div class="detail-value">
                <span class="airline-status status-activa">Activa</span>
            </div>
        </div>
    `;
    
    panel.classList.add('show');
    panel.style.display = 'block';
}

// Función para cerrar panel de detalles
function cerrarDetalles() {
    const panel = document.getElementById('airlineDetails');
    if (panel) {
        panel.classList.remove('show');
        setTimeout(() => {
            panel.style.display = 'none';
        }, 300);
    }
}

// Función para exportar datos de aerolíneas
function exportarAerolineas() {
    if (aerolineas.length === 0) {
        mostrarError('No hay datos para exportar');
        return;
    }
    
    let csv = 'ID,Nombre,País de Origen\n';
    aerolineas.forEach(aerolinea => {
        csv += `${aerolinea.id},"${aerolinea.nombre}","${aerolinea.paisOrigen}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aerolineas.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    mostrarExito('Datos exportados correctamente');
}

function mostrarExito(mensaje) {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `<div class="alert alert-success show">${mensaje}</div>`;
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 3000);
}

function mostrarError(mensaje) {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `<div class="alert alert-error show">${mensaje}</div>`;
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 3000);
}

// Event listeners para cerrar modales con Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarDialogo();
        cerrarDetalles();
    }
});

// Event listeners para cerrar modales al hacer clic fuera
document.getElementById('dialogoAerolinea')?.addEventListener('click', function(event) {
    if (event.target === this) {
        cerrarDialogo();
    }
});

document.getElementById('dialogoAerolineaEdicion')?.addEventListener('click', function(event) {
    if (event.target === this) {
        cerrarDialogo();
    }
});

// Validación en tiempo real para evitar duplicados
document.getElementById('nombreCreacion')?.addEventListener('blur', async function() {
    const nombre = this.value.trim();
    if (nombre) {
        const existe = await verificarAerolineaExistente(nombre);
        if (existe) {
            this.style.borderColor = '#e74c3c';
            mostrarError(`Ya existe una aerolínea con el nombre: ${nombre}`);
        } else {
            this.style.borderColor = '#2ecc71';
        }
    }
});

document.getElementById('nombreEdicion')?.addEventListener('blur', async function() {
    const nombre = this.value.trim();
    const id = document.getElementById('idAerolinea').value;
    if (nombre && id) {
        const existe = await verificarAerolineaEdicion(nombre, id);
        if (existe) {
            this.style.borderColor = '#e74c3c';
            mostrarError(`Ya existe otra aerolínea con el nombre: ${nombre}`);
        } else {
            this.style.borderColor = '#2ecc71';
        }
    }
});

// Event listener para búsqueda con Enter
document.getElementById('nombre')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarAerolineas();
    }
});

// Event listener para filtro de país
document.getElementById('paisFiltro')?.addEventListener('change', function() {
    buscarAerolineas();
});