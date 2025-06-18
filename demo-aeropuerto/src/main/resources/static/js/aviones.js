// Variables globales
let aerolineasDisponibles = [];
let vuelosDisponibles = [];

function buscarAviones() {
    let modelo = document.getElementById('modelo').value || '*';
    let aerolineaId = document.getElementById('aerolineaFiltro').value || '*';
    let capacidadMinima = document.getElementById('capacidadMinima').value || '0';
    
    fetch(`http://localhost:9999/consulta_aviones?modelo=${modelo}&idAerolinea=${aerolineaId}&capacidadMinima=${capacidadMinima}`, {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then(res => res.text())
    .then(json => {
        const aviones = JSON.parse(json);
        mostrarAviones(aviones);
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
        const aviones = JSON.parse(json);
        mostrarAviones(aviones);
        actualizarEstadisticas(aviones);
    })
    .catch(e => {
        console.log('Error cargando aviones: ' + e.message);
        mostrarError('Error al cargar aviones');
    });
}

function mostrarAviones(aviones) {
    let tabla = "";
    if (aviones && aviones.length > 0) {
        aviones.forEach(avion => {
            // Calcular estado del avión
            const estado = calcularEstadoAvion(avion);
            const estadoTexto = {
                'disponible': 'Disponible',
                'en-vuelo': 'En Vuelo',
                'mantenimiento': 'Mantenimiento',
                'fuera-servicio': 'Fuera de Servicio'
            };
            
            // Obtener nombre de aerolínea
            const nombreAerolinea = obtenerNombreAerolinea(avion.idAerolinea);
            
            // Obtener información de vuelo
            const infoVuelo = obtenerInfoVuelo(avion.idVuelo);
            
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
            tabla += "<td>" + nombreAerolinea + "</td>";
            tabla += "<td>" + (infoVuelo || '<span style="color: #999;">Sin asignar</span>') + "</td>";
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

// Función para verificar si existe un avión con el mismo modelo y aerolínea
async function verificarAvionExistente(modelo, idAerolinea) {
    try {
        const response = await fetch(`http://localhost:9999/verificar_avion?modelo=${modelo}&idAerolinea=${idAerolinea}`);
        const data = await response.json();
        return data.existe;
    } catch (e) {
        console.log('Error verificando avión: ' + e.message);
        return false;
    }
}

// Función para verificar avión en edición
async function verificarAvionEdicion(modelo, idAerolinea, id) {
    try {
        const response = await fetch(`http://localhost:9999/verificar_avion_edicion?modelo=${modelo}&idAerolinea=${idAerolinea}&id=${id}`);
        const data = await response.json();
        return data.existe;
    } catch (e) {
        console.log('Error verificando avión para edición: ' + e.message);
        return false;
    }
}

async function edicionAvion() {
    let id = document.getElementById('idAvion').value;
    let modelo = document.getElementById('modeloEdicion').value.trim();
    let capacidadAsientos = document.getElementById('capacidadAsientosEdicion').value;
    let idAerolinea = document.getElementById('aerolineaEdicion').value;
    let idVuelo = document.getElementById('vueloEdicion').value || null;

    if (!modelo || !capacidadAsientos || !idAerolinea) {
        mostrarError('Por favor complete todos los campos obligatorios');
        return;
    }

    if (capacidadAsientos < 1 || capacidadAsientos > 1000) {
        mostrarError('La capacidad debe estar entre 1 y 1000 asientos');
        return;
    }

    // Verificar si ya existe otro avión con el mismo modelo y aerolínea
    const existe = await verificarAvionEdicion(modelo, idAerolinea, id);
    if (existe) {
        mostrarError(`Ya existe otro avión ${modelo} en esta aerolínea`);
        return;
    }

    const params = new URLSearchParams({
        id: id,
        modelo: modelo,
        capacidadAsientos: capacidadAsientos,
        idAerolinea: idAerolinea
    });

    if (idVuelo) {
        params.append('idVuelo', idVuelo);
    }

    fetch(`http://localhost:9999/editar_avion?${params.toString()}`, {
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
        document.getElementById('capacidadAsientosCreacion').value = '';
        document.getElementById('aerolineaCreacion').value = '';
        document.getElementById('vueloCreacion').value = '';
        
        // Cargar opciones de aerolíneas y vuelos
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
        document.getElementById('capacidadAsientosEdicion').value = capacidadAsientos;
        
        // Cargar opciones y seleccionar las actuales
        cargarOpcionesAerolineas('aerolineaEdicion', idAerolinea);
        cargarOpcionesVuelos('vueloEdicion', idVuelo);
        
        dialogoAvionEdicion.showModal();
    }
}

async function crearAvion() {
    let modelo = document.getElementById('modeloCreacion').value.trim();
    let capacidadAsientos = document.getElementById('capacidadAsientosCreacion').value;
    let idAerolinea = document.getElementById('aerolineaCreacion').value;
    let idVuelo = document.getElementById('vueloCreacion').value || null;
    
    if (!modelo || !capacidadAsientos || !idAerolinea) {
        mostrarError('Por favor complete todos los campos obligatorios');
        return;
    }

    if (capacidadAsientos < 1 || capacidadAsientos > 1000) {
        mostrarError('La capacidad debe estar entre 1 y 1000 asientos');
        return;
    }

    // Verificar si ya existe un avión con el mismo modelo y aerolínea
    const existe = await verificarAvionExistente(modelo, idAerolinea);
    if (existe) {
        mostrarError(`Ya existe un avión ${modelo} en esta aerolínea`);
        return;
    }

    const params = new URLSearchParams({
        modelo: modelo,
        capacidadAsientos: capacidadAsientos,
        idAerolinea: idAerolinea
    });

    if (idVuelo) {
        params.append('idVuelo', idVuelo);
    }
    
    fetch(`http://localhost:9999/crear_avion?${params.toString()}`)
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

// Función para cargar aerolíneas para filtros
function cargarAerolineasParaFiltros() {
    fetch('http://localhost:9999/consulta_aerolineas?nombre=*')
    .then(res => res.text())
    .then(json => {
        const aerolineas = JSON.parse(json);
        aerolineasDisponibles = aerolineas;
        
        const selectFiltro = document.getElementById('aerolineaFiltro');
        if (selectFiltro) {
            let opciones = '<option value="">Todas las aerolíneas</option>';
            aerolineas.forEach(aerolinea => {
                opciones += `<option value="${aerolinea.id}">${aerolinea.nombre}</option>`;
            });
            selectFiltro.innerHTML = opciones;
        }
    })
    .catch(e => {
        console.log('Error cargando aerolíneas para filtros: ' + e.message);
    });
}

// Función para cargar vuelos para asignación
function cargarVuelosParaAsignacion() {
    fetch('http://localhost:9999/consulta_vuelos?origen=*&destino=*')
    .then(res => res.text())
    .then(json => {
        const vuelos = JSON.parse(json);
        vuelosDisponibles = vuelos;
    })
    .catch(e => {
        console.log('Error cargando vuelos: ' + e.message);
        vuelosDisponibles = [];
    });
}

// Función para cargar opciones de aerolíneas en selects
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

// Función para cargar opciones de vuelos en selects
function cargarOpcionesVuelos(selectId, selectedId = null) {
    const select = document.getElementById(selectId);
    if (select) {
        let opciones = '<option value="">Sin vuelo asignado</option>';
        if (vuelosDisponibles.length > 0) {
            vuelosDisponibles.forEach(vuelo => {
                const selected = selectedId == vuelo.id ? 'selected' : '';
                opciones += `<option value="${vuelo.id}" ${selected}>${vuelo.numeroVuelo} (${vuelo.origen} → ${vuelo.destino})</option>`;
            });
        }
        select.innerHTML = opciones;
    }
}

function actualizarEstadisticas(aviones) {
    const totalAviones = aviones.length;
    
    // Calcular aerolíneas únicas con aviones
    const aerolineasConFlota = new Set();
    let capacidadTotal = 0;
    let avionesEnServicio = 0;
    
    aviones.forEach(avion => {
        aerolineasConFlota.add(avion.idAerolinea);
        capacidadTotal += parseInt(avion.capacidadAsientos);
        
        const estado = calcularEstadoAvion(avion);
        if (estado === 'en-vuelo') {
            avionesEnServicio++;
        }
    });
    
    document.getElementById('totalAviones').textContent = totalAviones;
    document.getElementById('aerolineasConAviones').textContent = aerolineasConFlota.size;
    document.getElementById('capacidadTotal').textContent = capacidadTotal.toLocaleString();
    document.getElementById('avionesEnVuelo').textContent = avionesEnServicio;
}

// Función para calcular el estado de un avión
function calcularEstadoAvion(avion) {
    if (!avion.idVuelo) {
        return 'disponible';
    }
    
    // Simular estados basados en si tiene vuelo asignado
    // En producción, esto se basaría en datos reales de vuelo
    const estados = ['en-vuelo', 'disponible'];
    return estados[Math.floor(Math.random() * estados.length)];
}

// Función para obtener nombre de aerolínea
function obtenerNombreAerolinea(idAerolinea) {
    const aerolinea = aerolineasDisponibles.find(a => a.id == idAerolinea);
    return aerolinea ? aerolinea.nombre : 'Aerolínea desconocida';
}

// Función para obtener información de vuelo
function obtenerInfoVuelo(idVuelo) {
    if (!idVuelo) return null;
    
    const vuelo = vuelosDisponibles.find(v => v.id == idVuelo);
    return vuelo ? `${vuelo.numeroVuelo} (${vuelo.origen} → ${vuelo.destino})` : `Vuelo ID: ${idVuelo}`;
}

// Función para determinar tipo de avión
function determinarTipoAvion(modelo) {
    const modeloLower = modelo.toLowerCase();
    if (modeloLower.includes('boeing')) {
        return 'boeing';
    } else if (modeloLower.includes('airbus')) {
        return 'airbus';
    } else {
        return 'other';
    }
}

// Función para mostrar detalles del avión
function mostrarDetallesAvion(id) {
    // Esta función mostraría un panel lateral con detalles completos
    console.log('Mostrar detalles del avión ID:', id);
    // Implementación del panel de detalles...
}

// Función para cerrar panel de detalles
function cerrarDetalles() {
    const panel = document.getElementById('aircraftDetails');
    if (panel) {
        panel.classList.remove('show');
    }
}

// Función para exportar datos de aviones
function exportarAviones() {
    // Simular exportación
    mostrarExito('Funcionalidad de exportación en desarrollo');
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

// Validación en tiempo real para capacidad
document.getElementById('capacidadAsientosCreacion')?.addEventListener('input', function() {
    const capacidad = parseInt(this.value);
    if (capacidad < 1 || capacidad > 1000) {
        this.style.borderColor = '#e74c3c';
    } else {
        this.style.borderColor = '#2ecc71';
    }
});

document.getElementById('capacidadAsientosEdicion')?.addEventListener('input', function() {
    const capacidad = parseInt(this.value);
    if (capacidad < 1 || capacidad > 1000) {
        this.style.borderColor = '#e74c3c';
    } else {
        this.style.borderColor = '#2ecc71';
    }
});