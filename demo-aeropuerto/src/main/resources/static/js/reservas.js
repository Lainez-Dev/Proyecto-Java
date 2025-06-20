// Variables globales
let reservas = [];
let pasajerosDisponibles = [];
let vuelosDisponibles = [];

function buscarReservas() {
    let pasajeroId = document.getElementById('pasajeroFiltro').value || '*';
    let vueloId = document.getElementById('vueloFiltro').value || '*';
    let fecha = document.getElementById('fechaFiltro').value || '*';
    
    // Construir parámetros de búsqueda
    let parametros = `idPasajero=${pasajeroId}&idVuelo=${vueloId}`;
    if (fecha !== '*' && fecha !== '') {
        parametros += `&fecha=${fecha}`;
    }
    
    fetch(`http://localhost:9999/consulta_reservas_filtros?${parametros}`, {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then(res => res.text())
    .then(json => {
        const reservasData = JSON.parse(json);
        mostrarReservas(reservasData);
    })
    .catch(e => {
        console.log('Error buscando reservas: ' + e.message);
        mostrarError('Error al buscar reservas');
    });
}

function cargarReservas() {
    fetch("http://localhost:9999/consulta_reservas_todas", {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then(res => res.text())
    .then(json => {
        const reservasData = JSON.parse(json);
        reservas = reservasData;
        mostrarReservas(reservasData);
        actualizarEstadisticas(reservasData);
    })
    .catch(e => {
        console.log('Error cargando reservas: ' + e.message);
        mostrarError('Error al cargar reservas');
    });
}

function mostrarReservas(reservasData) {
    let tabla = "";
    if (reservasData && reservasData.length > 0) {
        reservasData.forEach(reserva => {
            // Buscar información del pasajero
            const pasajero = pasajerosDisponibles.find(p => p.id == reserva.idPasajero);
            const pasajeroNombre = pasajero ? `${pasajero.nombre} ${pasajero.apellido}` : `ID: ${reserva.idPasajero}`;
            const iniciales = pasajero ? `${pasajero.nombre.charAt(0)}${pasajero.apellido.charAt(0)}` : 'NA';
            
            // Buscar información del vuelo
            const vuelo = vuelosDisponibles.find(v => v.id == reserva.idVuelo);
            const vueloInfo = vuelo ? vuelo : { numeroVuelo: `ID: ${reserva.idVuelo}`, origen: 'N/A', destino: 'N/A' };
            
            // Calcular estado de la reserva
            const estado = calcularEstadoReserva(reserva.fechaReserva);
            const estadoTexto = {
                'confirmada': 'Confirmada',
                'pendiente': 'Pendiente',
                'cancelada': 'Cancelada'
            };
            
            // Formatear fecha
            const fechaFormateada = formatearFechaHora(reserva.fechaReserva);
            
            tabla += "<tr>";
            tabla += "<td>" + reserva.id + "</td>";
            tabla += "<td>";
            tabla += "<div class='passenger-info'>";
            tabla += "<div class='passenger-avatar'>" + iniciales + "</div>";
            tabla += "<div class='passenger-name'>" + pasajeroNombre + "</div>";
            tabla += "</div>";
            tabla += "</td>";
            tabla += "<td>";
            tabla += "<div class='flight-info'>";
            tabla += "<div class='flight-number'>" + vueloInfo.numeroVuelo + "</div>";
            tabla += "</div>";
            tabla += "</td>";
            tabla += "<td>";
            tabla += "<div class='flight-route'>";
            tabla += "<span>" + vueloInfo.origen + "</span>";
            tabla += "<i class='fas fa-arrow-right'></i>";
            tabla += "<span>" + vueloInfo.destino + "</span>";
            tabla += "</div>";
            tabla += "</td>";
            tabla += "<td>";
            tabla += "<div class='reservation-date'>";
            tabla += "<i class='fas fa-calendar-alt'></i>";
            tabla += "<span>" + fechaFormateada + "</span>";
            tabla += "</div>";
            tabla += "</td>";
            tabla += "<td><span class='reservation-status status-" + estado + "'>" + estadoTexto[estado] + "</span></td>";
            tabla += "<td class='table-actions'>";
            tabla += "<button class='btn btn-warning btn-sm' onclick=\"llamarModificarReserva('" + reserva.id + "', '" + reserva.idPasajero + "', '" + reserva.idVuelo + "', '" + reserva.fechaReserva + "')\"><i class='fas fa-edit'></i> Modificar</button>";
            tabla += "<button class='btn btn-danger btn-sm' onclick=\"eliminarReserva(" + reserva.id + ")\"><i class='fas fa-trash'></i> Eliminar</button>";
            tabla += "</td>";
            tabla += "</tr>";
        });
    } else {
        tabla = "<tr><td colspan='7' class='empty-state'><i class='fas fa-ticket-alt'></i><h3>No hay reservas registradas</h3><p>Comience agregando una nueva reserva</p></td></tr>";
    }
    
    var contenedor_tabla = document.getElementById("contenido_tabla");
    contenedor_tabla.innerHTML = tabla;
}

function eliminarReserva(id) {
    if (confirm('¿Está seguro de que desea eliminar esta reserva?')) {
        fetch('http://localhost:9999/borrar_reserva?id=' + id, {
            method: 'DELETE'
        })
        .then(res => res.text())
        .then(json => {
            cargarReservas();
            cerrarDialogo();
            mostrarExito('Reserva eliminada correctamente');
        })
        .catch(e => {
            console.log('Error eliminando reserva: ' + e.message);
            mostrarError('Error al eliminar reserva');
        });
    }
}

async function edicionReserva() {
    let id = document.getElementById('idReserva').value;
    let idPasajero = document.getElementById('pasajeroEdicion').value;
    let idVuelo = document.getElementById('vueloEdicion').value;
    let fechaReserva = document.getElementById('fechaReservaEdicion').value;

    if (!idPasajero || !idVuelo || !fechaReserva) {
        mostrarError('Por favor complete todos los campos');
        return;
    }

    // Convertir fecha al formato esperado
    const fechaFormatted = convertirFechaParaBackend(fechaReserva);

    fetch(`http://localhost:9999/editar_reserva?id=${id}&idPasajero=${idPasajero}&idVuelo=${idVuelo}&fechaReserva=${fechaFormatted}`, {
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
        cargarReservas();
        cerrarDialogo();
        mostrarExito('Reserva modificada correctamente');
    })
    .catch(e => {
        console.log('Error modificando reserva: ' + e);
        mostrarError('Error al modificar reserva: ' + e);
    });
}

function llamarDialogoReserva() {
    const dialogoReserva = document.getElementById('dialogoReserva');
    if (dialogoReserva) {
        // Limpiar campos
        document.getElementById('pasajeroCreacion').value = '';
        document.getElementById('vueloCreacion').value = '';
        
        // Establecer fecha actual
        const ahora = new Date();
        const fechaActual = ahora.toISOString().slice(0, 16);
        document.getElementById('fechaReservaCreacion').value = fechaActual;
        
        // Cargar opciones
        cargarOpcionesPasajeros('pasajeroCreacion');
        cargarOpcionesVuelos('vueloCreacion');
        
        dialogoReserva.showModal();
    }
}

function llamarModificarReserva(id, idPasajero, idVuelo, fechaReserva) {
    const dialogoReservaEdicion = document.getElementById('dialogoReservaEdicion');
    if (dialogoReservaEdicion) {
        // Llenar campos con datos existentes
        document.getElementById('idReserva').value = id;
        document.getElementById('pasajeroEdicion').value = idPasajero;
        document.getElementById('vueloEdicion').value = idVuelo;
        document.getElementById('fechaReservaEdicion').value = convertirFechaParaInput(fechaReserva);
        
        // Cargar opciones
        cargarOpcionesPasajeros('pasajeroEdicion', idPasajero);
        cargarOpcionesVuelos('vueloEdicion', idVuelo);
        
        dialogoReservaEdicion.showModal();
    }
}

async function crearReserva() {
    let idPasajero = document.getElementById('pasajeroCreacion').value;
    let idVuelo = document.getElementById('vueloCreacion').value;
    let fechaReserva = document.getElementById('fechaReservaCreacion').value;
    
    if (!idPasajero || !idVuelo || !fechaReserva) {
        mostrarError('Por favor complete todos los campos');
        return;
    }

    // Verificar si ya existe una reserva para este pasajero y vuelo
    const existe = await verificarReservaExistente(idPasajero, idVuelo);
    if (existe) {
        mostrarError('Ya existe una reserva para este pasajero en este vuelo');
        return;
    }

    // Convertir fecha al formato esperado
    const fechaFormatted = convertirFechaParaBackend(fechaReserva);
    
    fetch(`http://localhost:9999/crear_reserva?idPasajero=${idPasajero}&idVuelo=${idVuelo}&fechaReserva=${fechaFormatted}`)
    .then(res => {
        if (res.ok) {
            return res.text();
        } else {
            return res.text().then(text => Promise.reject(text));
        }
    })
    .then(json => {
        cargarReservas();
        cerrarDialogo();
        mostrarExito('Reserva creada correctamente');
    })
    .catch(e => {
        console.log('Error creando reserva: ' + e);
        mostrarError('Error al crear reserva: ' + e);
    });
}

function cerrarDialogo() {
    const dialogoReserva = document.getElementById('dialogoReserva');
    const dialogoReservaEdicion = document.getElementById('dialogoReservaEdicion');
    
    if (dialogoReserva) {
        dialogoReserva.close();
    }
    if (dialogoReservaEdicion) {
        dialogoReservaEdicion.close();
    }
}

// Función para cargar datos necesarios para los filtros
function cargarDatosParaFiltros() {
    // Cargar pasajeros
    fetch('http://localhost:9999/consulta_pasajeros?dni=*')
    .then(res => res.text())
    .then(json => {
        pasajerosDisponibles = JSON.parse(json);
        actualizarFiltrosPasajeros();
    })
    .catch(e => {
        console.log('Error cargando pasajeros: ' + e.message);
    });
    
    // Cargar vuelos
    fetch('http://localhost:9999/consulta_vuelos?origen=*&destino=*')
    .then(res => res.text())
    .then(json => {
        vuelosDisponibles = JSON.parse(json);
        actualizarFiltrosVuelos();
    })
    .catch(e => {
        console.log('Error cargando vuelos: ' + e.message);
    });
}

function actualizarFiltrosPasajeros() {
    const selectFiltro = document.getElementById('pasajeroFiltro');
    if (selectFiltro && pasajerosDisponibles.length > 0) {
        let opciones = '<option value="">Todos los pasajeros</option>';
        pasajerosDisponibles.forEach(pasajero => {
            opciones += `<option value="${pasajero.id}">${pasajero.nombre} ${pasajero.apellido}</option>`;
        });
        selectFiltro.innerHTML = opciones;
    }
}

function actualizarFiltrosVuelos() {
    const selectFiltro = document.getElementById('vueloFiltro');
    if (selectFiltro && vuelosDisponibles.length > 0) {
        let opciones = '<option value="">Todos los vuelos</option>';
        vuelosDisponibles.forEach(vuelo => {
            opciones += `<option value="${vuelo.id}">${vuelo.numeroVuelo} (${vuelo.origen} → ${vuelo.destino})</option>`;
        });
        selectFiltro.innerHTML = opciones;
    }
}

function cargarOpcionesPasajeros(selectId, selectedId = null) {
    const select = document.getElementById(selectId);
    if (select && pasajerosDisponibles.length > 0) {
        let opciones = '<option value="">Seleccione un pasajero</option>';
        pasajerosDisponibles.forEach(pasajero => {
            const selected = selectedId == pasajero.id ? 'selected' : '';
            opciones += `<option value="${pasajero.id}" ${selected}>${pasajero.nombre} ${pasajero.apellido} (${pasajero.dni})</option>`;
        });
        select.innerHTML = opciones;
    }
}

function cargarOpcionesVuelos(selectId, selectedId = null) {
    const select = document.getElementById(selectId);
    if (select && vuelosDisponibles.length > 0) {
        let opciones = '<option value="">Seleccione un vuelo</option>';
        vuelosDisponibles.forEach(vuelo => {
            const selected = selectedId == vuelo.id ? 'selected' : '';
            const fechaSalida = formatearFecha(vuelo.fechaSalida);
            opciones += `<option value="${vuelo.id}" ${selected}>${vuelo.numeroVuelo} - ${vuelo.origen} → ${vuelo.destino} (${fechaSalida})</option>`;
        });
        select.innerHTML = opciones;
    }
}

function actualizarEstadisticas(reservasData) {
    const totalReservas = reservasData.length;
    
    // Calcular reservas de hoy
    const hoy = new Date().toISOString().split('T')[0];
    const reservasHoy = reservasData.filter(r => {
        const fechaReserva = new Date(r.fechaReserva).toISOString().split('T')[0];
        return fechaReserva === hoy;
    }).length;
    
    // Simular reservas confirmadas (80% del total)
    const reservasConfirmadas = Math.ceil(totalReservas * 0.8);
    
    // Calcular pasajeros únicos con reserva
    const pasajerosUnicos = new Set(reservasData.map(r => r.idPasajero)).size;
    
    document.getElementById('totalReservas').textContent = totalReservas;
    document.getElementById('reservasHoy').textContent = reservasHoy;
    document.getElementById('reservasConfirmadas').textContent = reservasConfirmadas;
    document.getElementById('pasajerosConReserva').textContent = pasajerosUnicos;
}

// Función para calcular el estado de una reserva
function calcularEstadoReserva(fechaReserva) {
    try {
        const ahora = new Date();
        const fecha = new Date(fechaReserva);
        const diferenciaDias = Math.floor((ahora - fecha) / (1000 * 60 * 60 * 24));
        
        if (diferenciaDias < 0) {
            return 'pendiente'; // Reserva futura
        } else if (diferenciaDias <= 30) {
            return 'confirmada'; // Reserva reciente
        } else {
            return Math.random() > 0.9 ? 'cancelada' : 'confirmada'; // Muy pocas canceladas
        }
    } catch (error) {
        return 'confirmada';
    }
}

// Función para verificar si existe una reserva duplicada
async function verificarReservaExistente(idPasajero, idVuelo) {
    try {
        const response = await fetch(`http://localhost:9999/verificar_reserva?idPasajero=${idPasajero}&idVuelo=${idVuelo}`);
        const data = await response.json();
        return data.existe;
    } catch (e) {
        console.log('Error verificando reserva: ' + e.message);
        return false;
    }
}

// Función para exportar reservas
function exportarReservas() {
    if (reservas.length === 0) {
        mostrarError('No hay datos para exportar');
        return;
    }
    
    let csv = 'ID,Pasajero,Vuelo,Ruta,Fecha Reserva,Estado\n';
    reservas.forEach(reserva => {
        const pasajero = pasajerosDisponibles.find(p => p.id == reserva.idPasajero);
        const vuelo = vuelosDisponibles.find(v => v.id == reserva.idVuelo);
        const pasajeroNombre = pasajero ? `${pasajero.nombre} ${pasajero.apellido}` : `ID: ${reserva.idPasajero}`;
        const vueloInfo = vuelo ? vuelo.numeroVuelo : `ID: ${reserva.idVuelo}`;
        const ruta = vuelo ? `${vuelo.origen} → ${vuelo.destino}` : 'N/A';
        const estado = calcularEstadoReserva(reserva.fechaReserva);
        
        csv += `${reserva.id},"${pasajeroNombre}","${vueloInfo}","${ruta}","${reserva.fechaReserva}","${estado}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reservas.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    mostrarExito('Datos exportados correctamente');
}

// Funciones auxiliares
function formatearFechaHora(fechaString) {
    try {
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-ES') + ' ' + fecha.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return fechaString;
    }
}

function formatearFecha(fechaString) {
    try {
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-ES');
    } catch (error) {
        return fechaString;
    }
}

function convertirFechaParaBackend(fechaLocal) {
    try {
        const fecha = new Date(fechaLocal);
        return fecha.toISOString().split('T')[0];
    } catch (error) {
        return fechaLocal;
    }
}

function convertirFechaParaInput(fechaString) {
    try {
        const fecha = new Date(fechaString);
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        const hours = String(fecha.getHours()).padStart(2, '0');
        const minutes = String(fecha.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
        return '';
    }
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
    }
});

// Event listeners para cerrar modales al hacer clic fuera
document.getElementById('dialogoReserva')?.addEventListener('click', function(event) {
    if (event.target === this) {
        cerrarDialogo();
    }
});

document.getElementById('dialogoReservaEdicion')?.addEventListener('click', function(event) {
    if (event.target === this) {
        cerrarDialogo();
    }
});

// Event listeners para filtros
document.getElementById('pasajeroFiltro')?.addEventListener('change', function() {
    buscarReservas();
});

document.getElementById('vueloFiltro')?.addEventListener('change', function() {
    buscarReservas();
});

document.getElementById('fechaFiltro')?.addEventListener('change', function() {
    buscarReservas();
});