// Variables globales
let aviones = [];
let aerolineasDisponibles = [];
let vuelosDisponibles = [];

function buscarAviones() {
    let modelo = document.getElementById('modeloFiltro').value || '*';
    let aerolineaId = document.getElementById('aerolineaFiltro').value || '*';
    let capacidadMinima = document.getElementById('capacidadMinima').value || '0';
    
    // Construir parámetros de búsqueda
    let parametros = `modelo=${modelo}&idAerolinea=${aerolineaId}&capacidadMinima=${capacidadMinima}`;
    
    fetch(`http://localhost:9999/consulta_aviones?${parametros}`, {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then(res => res.text())
    .then(json => {
        const avionesData = JSON.parse(json);
        mostrarAviones(avionesData);
    })
    .catch(e => {
        console.log('Error buscando aviones: ' + e.message);
        mostrarError('Error al buscar aviones');
    });
}

function cargarAviones() {
    fetch("http://localhost:9999/consulta_aviones?modelo=*&idAerolinea=*&capacidadMinima=0", {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then(res => res.text())
    .then(json => {
        const avionesData = JSON.parse(json);
        aviones = avionesData;
        mostrarAviones(avionesData);
        actualizarEstadisticas(avionesData);
    })
    .catch(e => {
        console.log('Error cargando aviones: ' + e.message);
        mostrarError('Error al cargar aviones');
    });
}

function mostrarAviones(avionesData) {
    let tabla = "";
    if (avionesData && avionesData.length > 0) {
        avionesData.forEach(avion => {
            // Buscar información de la aerolínea
            const aerolinea = aerolineasDisponibles.find(a => a.id == avion.idAerolinea);
            const nombreAerolinea = aerolinea ? aerolinea.nombre : `ID: ${avion.idAerolinea}`;
            const iniciales = aerolinea ? aerolinea.nombre.split(' ').map(p => p.charAt(0)).slice(0, 2).join('') : 'NA';
            
            // Buscar información del vuelo
            const vuelo = vuelosDisponibles.find(v => v.id == avion.idVuelo);
            const vueloInfo = vuelo ? `${vuelo.numeroVuelo} (${vuelo.origen} → ${vuelo.destino})` : null;
            
            // Calcular estado del avión
            const estado = calcularEstadoAvion(avion);
            const estadoTexto = {
                'disponible': 'Disponible',
                'en-vuelo': 'En Vuelo',
                'mantenimiento': 'Mantenimiento',
                'fuera-servicio': 'Fuera de Servicio'
            };
            
            // Determinar tipo de avión para iconos
            const tipoAvion = determinarTipoAvion(avion.modelo);
            
            tabla += "<tr onclick=\"mostrarDetallesAvion(" + avion.id + ")\" style=\"cursor: pointer;\">";
            tabla += "<td>" + avion.id + "</td>";
            tabla += "<td>";
            tabla += "<span class='aircraft-type-icon " + tipoAvion + "'></span>";
            tabla += "<span class='model-badge'>" + avion.modelo + "</span>";
            tabla += "</td>";
            tabla += "<td>";
            tabla += "<span class='capacity-info'>";
            tabla += "<i class='fas fa-users'></i>" + avion.capacidadAsientos + " asientos";
            tabla += "</span>";
            tabla += "</td>";
            tabla += "<td>";
            tabla += "<div class='airline-info'>";
            tabla += "<div class='airline-logo-mini'>" + iniciales + "</div>";
            tabla += "<span>" + nombreAerolinea + "</span>";
            tabla += "</div>";
            tabla += "</td>";
            tabla += "<td>";
            if (vueloInfo) {
                tabla += "<span class='flight-assignment'><i class='fas fa-plane'></i>" + vueloInfo + "</span>";
            } else {
                tabla += "<span style='color: #999;'>Sin asignar</span>";
            }
            tabla += "</td>";
            tabla += "<td><span class='aircraft-status status-" + estado + "'>" + estadoTexto[estado] + "</span></td>";
            tabla += "<td class='table-actions' onclick='event.stopPropagation()'>";
            tabla += "<button class='btn btn-warning btn-sm' onclick=\"llamarModificarAvion('" + avion.id + "', '" + avion.modelo + "', '" + avion.capacidadAsientos + "', '" + avion.idAerolinea + "', '" + (avion.idVuelo || '') + "')\"><i class='fas fa-edit'></i> Modificar</button>";
            tabla += "<button class='btn btn-danger btn-sm' onclick=\"eliminarAvion(" + avion.id + ")\"><i class='fas fa-trash'></i> Eliminar</button>";
            tabla += "</td>";
            tabla += "</tr>";
        });
    } else {
        tabla = "<tr><td colspan='7' class='empty-state'><i class='fas fa-fighter-jet'></i><h3>No hay aviones registrados</h3><p>Comience agregando un nuevo avión</p></td></tr>";
    }
    
    var contenedor_tabla = document.getElementById("contenido_tabla");
    contenedor_tabla.innerHTML = tabla;
}

function eliminarAvion(id) {
    if (confirm('¿Está seguro de que desea eliminar este avión?')) {
        fetch('http://localhost:9999/borrar_avion?id=' + id, {
            method: 'DELETE'
        })
        .then(res => res.text())
        .then(json => {
            cargarAviones();
            cerrarDialogo();
            mostrarExito('Avión eliminado correctamente');
        })
        .catch(e => {
            console.log('Error eliminando avión: ' + e.message);
            mostrarError('Error al eliminar avión');
        });
    }
}

async function edicionAvion() {
    let id = document.getElementById('idAvion').value;
    let modelo = document.getElementById('modeloEdicion').value;
    let capacidadAsientos = document.getElementById('capacidadEdicion').value;
    let idAerolinea = document.getElementById('aerolineaEdicion').value;
    let idVuelo = document.getElementById('vueloEdicion').value || null;

    if (!modelo || !capacidadAsientos || !idAerolinea) {
        mostrarError('Por favor complete todos los campos obligatorios');
        return;
    }

    // Validar capacidad
    if (capacidadAsientos < 1 || capacidadAsientos > 1000) {
        mostrarError('La capacidad debe estar entre 1 y 1000 asientos');
        return;
    }

    let parametros = `id=${id}&modelo=${encodeURIComponent(modelo)}&capacidadAsientos=${capacidadAsientos}&idAerolinea=${idAerolinea}`;
    if (idVuelo) {
        parametros += `&idVuelo=${idVuelo}`;
    }

    fetch(`http://localhost:9999/editar_avion?${parametros}`, {
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
        cargarAviones();
        cerrarDialogo();
        mostrarExito('Avión modificado correctamente');
    })
    .catch(e => {
        console.log('Error modificando avión: ' + e);
        mostrarError('Error al modificar avión: ' + e);
    });
}

function llamarDialogoAvion() {
    const dialogoAvion = document.getElementById('dialogoAvion');
    if (dialogoAvion) {
        // Limpiar campos
        document.getElementById('modeloCreacion').value = '';
        document.getElementById('capacidadCreacion').value = '';
        document.getElementById('aerolineaCreacion').value = '';
        document.getElementById('vueloCreacion').value = '';
        
        // Cargar opciones
        cargarOpcionesAerolineas('aerolineaCreacion');
        cargarOpcionesVuelos('vueloCreacion');
        
        dialogoAvion.showModal();
    }
}

function llamarModificarAvion(id, modelo, capacidadAsientos, idAerolinea, idVuelo) {
    const dialogoAvionEdicion = document.getElementById('dialogoAvionEdicion');
    if (dialogoAvionEdicion) {
        // Llenar campos con datos existentes
        document.getElementById('idAvion').value = id;
        document.getElementById('modeloEdicion').value = modelo;
        document.getElementById('capacidadEdicion').value = capacidadAsientos;
        document.getElementById('aerolineaEdicion').value = idAerolinea;
        document.getElementById('vueloEdicion').value = idVuelo || '';
        
        // Cargar opciones
        cargarOpcionesAerolineas('aerolineaEdicion', idAerolinea);
        cargarOpcionesVuelos('vueloEdicion', idVuelo);
        
        dialogoAvionEdicion.showModal();
    }
}

async function crearAvion() {
    let modelo = document.getElementById('modeloCreacion').value;
    let capacidadAsientos = document.getElementById('capacidadCreacion').value;
    let idAerolinea = document.getElementById('aerolineaCreacion').value;
    let idVuelo = document.getElementById('vueloCreacion').value || null;
    
    if (!modelo || !capacidadAsientos || !idAerolinea) {
        mostrarError('Por favor complete todos los campos obligatorios');
        return;
    }

    // Validar capacidad
    if (capacidadAsientos < 1 || capacidadAsientos > 1000) {
        mostrarError('La capacidad debe estar entre 1 y 1000 asientos');
        return;
    }

    let parametros = `modelo=${encodeURIComponent(modelo)}&capacidadAsientos=${capacidadAsientos}&idAerolinea=${idAerolinea}`;
    if (idVuelo) {
        parametros += `&idVuelo=${idVuelo}`;
    }
    
    fetch(`http://localhost:9999/crear_avion?${parametros}`)
    .then(res => {
        if (res.ok) {
            return res.text();
        } else {
            return res.text().then(text => Promise.reject(text));
        }
    })
    .then(json => {
        cargarAviones();
        cerrarDialogo();
        mostrarExito('Avión creado correctamente');
    })
    .catch(e => {
        console.log('Error creando avión: ' + e);
        mostrarError('Error al crear avión: ' + e);
    });
}

function cerrarDialogo() {
    const dialogoAvion = document.getElementById('dialogoAvion');
    const dialogoAvionEdicion = document.getElementById('dialogoAvionEdicion');
    
    if (dialogoAvion) {
        dialogoAvion.close();
    }
    if (dialogoAvionEdicion) {
        dialogoAvionEdicion.close();
    }
}

// Función para cargar aerolíneas disponibles
function cargarAerolineasParaFiltros() {
    fetch('http://localhost:9999/consulta_aerolineas?nombre=*&paisOrigen=*')
    .then(res => res.text())
    .then(json => {
        aerolineasDisponibles = JSON.parse(json);
        actualizarFiltrosAerolineas();
    })
    .catch(e => {
        console.log('Error cargando aerolíneas: ' + e.message);
    });
}

function cargarVuelosParaAsignacion() {
    fetch('http://localhost:9999/consulta_vuelos?origen=*&destino=*')
    .then(res => res.text())
    .then(json => {
        vuelosDisponibles = JSON.parse(json);
    })
    .catch(e => {
        console.log('Error cargando vuelos: ' + e.message);
    });
}

function actualizarFiltrosAerolineas() {
    const selectFiltro = document.getElementById('aerolineaFiltro');
    if (selectFiltro && aerolineasDisponibles.length > 0) {
        let opciones = '<option value="">Todas las aerolíneas</option>';
        aerolineasDisponibles.forEach(aerolinea => {
            opciones += `<option value="${aerolinea.id}">${aerolinea.nombre}</option>`;
        });
        selectFiltro.innerHTML = opciones;
    }
}

function cargarOpcionesAerolineas(selectId, selectedId = null) {
    const select = document.getElementById(selectId);
    if (select && aerolineasDisponibles.length > 0) {
        let opciones = '<option value="">Seleccione una aerolínea</option>';
        aerolineasDisponibles.forEach(aerolinea => {
            const selected = selectedId == aerolinea.id ? 'selected' : '';
            opciones += `<option value="${aerolinea.id}" ${selected}>${aerolinea.nombre}</option>`;
        });
        select.innerHTML = opciones;
    }
}

function cargarOpcionesVuelos(selectId, selectedId = null) {
    const select = document.getElementById(selectId);
    if (select && vuelosDisponibles.length > 0) {
        let opciones = '<option value="">Sin asignar vuelo</option>';
        vuelosDisponibles.forEach(vuelo => {
            const selected = selectedId == vuelo.id ? 'selected' : '';
            opciones += `<option value="${vuelo.id}" ${selected}>${vuelo.numeroVuelo} - ${vuelo.origen} → ${vuelo.destino}</option>`;
        });
        select.innerHTML = opciones;
    }
}

function actualizarEstadisticas(avionesData) {
    const totalAviones = avionesData.length;
    
    // Contar aviones por estado
    let disponibles = 0;
    let enVuelo = 0;
    let capacidadTotal = 0;
    
    avionesData.forEach(avion => {
        const estado = calcularEstadoAvion(avion);
        if (estado === 'disponible') disponibles++;
        if (estado === 'en-vuelo') enVuelo++;
        capacidadTotal += parseInt(avion.capacidadAsientos);
    });
    
    document.getElementById('totalAviones').textContent = totalAviones;
    document.getElementById('avionesDisponibles').textContent = disponibles;
    document.getElementById('avionesEnVuelo').textContent = enVuelo;
    document.getElementById('capacidadTotal').textContent = capacidadTotal.toLocaleString();
}

// Función para calcular el estado de un avión
function calcularEstadoAvion(avion) {
    if (avion.idVuelo) {
        // Si tiene vuelo asignado, verificar si está en vuelo
        const vuelo = vuelosDisponibles.find(v => v.id == avion.idVuelo);
        if (vuelo) {
            const ahora = new Date();
            const fechaSalida = new Date(vuelo.fechaSalida);
            const fechaLlegada = new Date(vuelo.fechaLlegada);
            
            if (ahora >= fechaSalida && ahora <= fechaLlegada) {
                return 'en-vuelo';
            }
        }
    }
    
    // Simular otros estados basado en probabilidades
    const random = Math.random();
    if (random < 0.05) return 'mantenimiento';
    if (random < 0.08) return 'fuera-servicio';
    return 'disponible';
}

// Función para determinar el tipo de avión
function determinarTipoAvion(modelo) {
    const modeloLower = modelo.toLowerCase();
    
    if (modeloLower.includes('boeing') || modeloLower.includes('airbus') || modeloLower.includes('737') || modeloLower.includes('a320') || modeloLower.includes('a380')) {
        return 'commercial';
    } else if (modeloLower.includes('cessna') || modeloLower.includes('piper') || modeloLower.includes('beech')) {
        return 'private';
    } else if (modeloLower.includes('cargo') || modeloLower.includes('freight')) {
        return 'cargo';
    } else if (modeloLower.includes('helicopter') || modeloLower.includes('helicoptero')) {
        return 'fighter';
    }
    
    return 'commercial'; // Por defecto
}

// Función para mostrar detalles del avión
function mostrarDetallesAvion(id) {
    const avion = aviones.find(a => a.id == id);
    if (!avion) return;
    
    const aerolinea = aerolineasDisponibles.find(a => a.id == avion.idAerolinea);
    const vuelo = vuelosDisponibles.find(v => v.id == avion.idVuelo);
    const estado = calcularEstadoAvion(avion);
    
    const detailsContent = document.getElementById('detailsContent');
    detailsContent.innerHTML = `
        <div class="aircraft-model">${avion.modelo}</div>
        
        <div class="aircraft-specs">
            <div class="spec-item">
                <span class="spec-label">ID del Avión:</span>
                <span class="spec-value">#${avion.id}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Capacidad:</span>
                <span class="spec-value">${avion.capacidadAsientos} asientos</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Aerolínea:</span>
                <span class="spec-value">${aerolinea ? aerolinea.nombre : 'N/A'}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Estado:</span>
                <span class="spec-value aircraft-status status-${estado}">${estado.replace('-', ' ').toUpperCase()}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Vuelo Asignado:</span>
                <span class="spec-value">${vuelo ? `${vuelo.numeroVuelo} (${vuelo.origen} → ${vuelo.destino})` : 'Sin asignar'}</span>
            </div>
        </div>
        
        <div class="aircraft-history">
            <h4>Información Adicional</h4>
            <div class="history-item">
                <strong>Tipo de Aeronave:</strong> ${determinarTipoAvion(avion.modelo) === 'commercial' ? 'Comercial' : 'Otros'}
            </div>
            <div class="history-item">
                <strong>Última Actualización:</strong> ${new Date().toLocaleDateString('es-ES')}
            </div>
            <div class="history-item">
                <strong>Disponibilidad:</strong> ${estado === 'disponible' ? 'Disponible para asignación' : 'No disponible'}
            </div>
        </div>
    `;
    
    const aircraftDetails = document.getElementById('aircraftDetails');
    aircraftDetails.classList.add('show');
}

function cerrarDetalles() {
    const aircraftDetails = document.getElementById('aircraftDetails');
    aircraftDetails.classList.remove('show');
}

// Función para exportar aviones
function exportarAviones() {
    if (aviones.length === 0) {
        mostrarError('No hay datos para exportar');
        return;
    }
    
    let csv = 'ID,Modelo,Capacidad,Aerolínea,Vuelo Asignado,Estado\n';
    aviones.forEach(avion => {
        const aerolinea = aerolineasDisponibles.find(a => a.id == avion.idAerolinea);
        const vuelo = vuelosDisponibles.find(v => v.id == avion.idVuelo);
        const nombreAerolinea = aerolinea ? aerolinea.nombre : `ID: ${avion.idAerolinea}`;
        const vueloInfo = vuelo ? `${vuelo.numeroVuelo} (${vuelo.origen} → ${vuelo.destino})` : 'Sin asignar';
        const estado = calcularEstadoAvion(avion);
        
        csv += `${avion.id},"${avion.modelo}","${avion.capacidadAsientos} asientos","${nombreAerolinea}","${vueloInfo}","${estado}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aviones.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    mostrarExito('Datos exportados correctamente');
}

// Funciones auxiliares
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
document.getElementById('dialogoAvion')?.addEventListener('click', function(event) {
    if (event.target === this) {
        cerrarDialogo();
    }
});

document.getElementById('dialogoAvionEdicion')?.addEventListener('click', function(event) {
    if (event.target === this) {
        cerrarDialogo();
    }
});

// Event listeners para filtros
document.getElementById('modeloFiltro')?.addEventListener('input', function() {
    // Buscar automáticamente después de un pequeño delay
    setTimeout(buscarAviones, 300);
});

document.getElementById('aerolineaFiltro')?.addEventListener('change', function() {
    buscarAviones();
});

document.getElementById('capacidadMinima')?.addEventListener('input', function() {
    setTimeout(buscarAviones, 300);
});