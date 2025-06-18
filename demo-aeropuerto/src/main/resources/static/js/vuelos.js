function buscarVuelos() {
    let origen = document.getElementById('origen').value || '*';
    let destino = document.getElementById('destino').value || '*';
    let numeroVuelo = document.getElementById('numeroVuelo').value || '*';
    
    fetch(`http://localhost:9999/consulta_vuelos?origen=${origen}&destino=${destino}&numeroVuelo=${numeroVuelo}`, {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then(res => res.text())
    .then(json => {
        const vuelos = JSON.parse(json);
        mostrarVuelos(vuelos);
    })
    .catch(e => {
        console.log('Error buscando vuelos: ' + e.message);
        mostrarError('Error al buscar vuelos');
    });
}

function cargarVuelos() {
    fetch("http://localhost:9999/consulta_vuelos?origen=*&destino=*", {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then(res => res.text())
    .then(json => {
        const vuelos = JSON.parse(json);
        mostrarVuelos(vuelos);
        actualizarEstadisticas(vuelos);
    })
    .catch(e => {
        console.log('Error cargando vuelos: ' + e.message);
        mostrarError('Error al cargar vuelos');
    });
}

function mostrarVuelos(vuelos) {
    let tabla = "";
    if (vuelos && vuelos.length > 0) {
        vuelos.forEach(vuelo => {
            // Calcular estado real basado en fechas y hora actual
            const estadoReal = calcularEstadoVuelo(vuelo.fechaSalida, vuelo.fechaLlegada);
            const estadoTexto = {
                'a-tiempo': 'A tiempo',
                'embarcando': 'Embarcando',
                'despego': 'Despegó',
                'llego': 'Llegó',
                'retrasado': 'Retrasado'
            };
            
            const fechaSalida = formatearFechaHora(vuelo.fechaSalida);
            const fechaLlegada = formatearFechaHora(vuelo.fechaLlegada);
            
            tabla += "<tr>";
            tabla += "<td>" + vuelo.id + "</td>";
            tabla += "<td><strong>" + vuelo.numeroVuelo + "</strong></td>";
            tabla += "<td>" + vuelo.origen + "</td>";
            tabla += "<td>" + vuelo.destino + "</td>";
            tabla += "<td>" + fechaSalida + "</td>";
            tabla += "<td>" + fechaLlegada + "</td>";
            tabla += "<td><span class='flight-status status-" + estadoReal + "'>" + estadoTexto[estadoReal] + "</span></td>";
            tabla += "<td class='table-actions'>";
            tabla += "<button class='btn btn-warning btn-sm' onclick=\"llamarModificarVuelo('" + vuelo.id + "', '" + vuelo.numeroVuelo + "', '" + vuelo.origen + "', '" + vuelo.destino + "', '" + vuelo.fechaSalida + "', '" + vuelo.fechaLlegada + "')\"><i class='fas fa-edit'></i> Modificar</button>";
            tabla += "<button class='btn btn-danger btn-sm' onclick=\"eliminarVuelo(" + vuelo.id + ")\"><i class='fas fa-trash'></i> Eliminar</button>";
            tabla += "</td>";
            tabla += "</tr>";
        });
    } else {
        tabla = "<tr><td colspan='8' class='empty-state'><i class='fas fa-plane'></i><h3>No hay vuelos registrados</h3><p>Comience agregando un nuevo vuelo</p></td></tr>";
    }
    
    var contenedor_tabla = document.getElementById("contenido_tabla");
    contenedor_tabla.innerHTML = tabla;
}

// Función para calcular el estado real del vuelo basado en fechas y hora actual
function calcularEstadoVuelo(fechaSalidaStr, fechaLlegadaStr) {
    try {
        const ahora = new Date();
        const fechaSalida = new Date(fechaSalidaStr);
        const fechaLlegada = new Date(fechaLlegadaStr);
        
        // Calcular diferencias en minutos
        const minutosHastaSalida = Math.floor((fechaSalida - ahora) / (1000 * 60));
        const minutosHastaLlegada = Math.floor((fechaLlegada - ahora) / (1000 * 60));
        
        // Lógica de estados basada en tiempo real
        if (minutosHastaLlegada < 0) {
            // Ya pasó la hora de llegada
            return 'llego';
        } else if (minutosHastaSalida < 0) {
            // Ya pasó la hora de salida pero no la de llegada
            return 'despego';
        } else if (minutosHastaSalida <= 30) {
            // Falta 30 minutos o menos para la salida - embarcando
            return 'embarcando';
        } else {
            // Aún falta tiempo para la salida - a tiempo
            return 'a-tiempo';
        }
    } catch (error) {
        console.log('Error calculando estado del vuelo:', error);
        // En caso de error, retornar estado por defecto
        return 'a-tiempo';
    }
}

// Función mejorada para actualizar estadísticas con estados reales
function actualizarEstadisticas(vuelos) {
    const totalVuelos = vuelos.length;
    const ahora = new Date();
    
    // Calcular estadísticas reales basadas en fechas
    let vuelosHoy = 0;
    let vuelosActivos = 0;
    
    vuelos.forEach(vuelo => {
        const fechaSalida = new Date(vuelo.fechaSalida);
        const fechaLlegada = new Date(vuelo.fechaLlegada);
        
        // Vuelos de hoy (salida en el día actual)
        if (esMismaFecha(fechaSalida, ahora)) {
            vuelosHoy++;
        }
        
        // Vuelos activos (entre salida y llegada)
        if (ahora >= fechaSalida && ahora <= fechaLlegada) {
            vuelosActivos++;
        }
    });
    
    // Calcular rutas únicas
    const rutasUnicas = new Set();
    vuelos.forEach(vuelo => {
        rutasUnicas.add(`${vuelo.origen}-${vuelo.destino}`);
    });
    
    document.getElementById('totalVuelos').textContent = totalVuelos;
    document.getElementById('vuelosHoy').textContent = vuelosHoy;
    document.getElementById('vuelosActivos').textContent = vuelosActivos;
    document.getElementById('rutasUnicas').textContent = rutasUnicas.size;
}

// Función auxiliar para verificar si dos fechas son del mismo día
function esMismaFecha(fecha1, fecha2) {
    return fecha1.getFullYear() === fecha2.getFullYear() &&
           fecha1.getMonth() === fecha2.getMonth() &&
           fecha1.getDate() === fecha2.getDate();
}

// Función para obtener información detallada del estado de un vuelo
function obtenerInfoEstadoVuelo(fechaSalidaStr, fechaLlegadaStr) {
    try {
        const ahora = new Date();
        const fechaSalida = new Date(fechaSalidaStr);
        const fechaLlegada = new Date(fechaLlegadaStr);
        
        const minutosHastaSalida = Math.floor((fechaSalida - ahora) / (1000 * 60));
        const minutosHastaLlegada = Math.floor((fechaLlegada - ahora) / (1000 * 60));
        
        if (minutosHastaLlegada < 0) {
            const tiempoDesdeArribo = Math.abs(minutosHastaLlegada);
            return {
                estado: 'llego',
                descripcion: `Llegó hace ${formatearTiempo(tiempoDesdeArribo)}`
            };
        } else if (minutosHastaSalida < 0) {
            const tiempoEnVuelo = Math.abs(minutosHastaSalida);
            const tiempoRestante = minutosHastaLlegada;
            return {
                estado: 'despego',
                descripcion: `En vuelo desde hace ${formatearTiempo(tiempoEnVuelo)}, llegada en ${formatearTiempo(tiempoRestante)}`
            };
        } else if (minutosHastaSalida <= 30) {
            return {
                estado: 'embarcando',
                descripcion: `Embarcando - Salida en ${formatearTiempo(minutosHastaSalida)}`
            };
        } else {
            return {
                estado: 'a-tiempo',
                descripcion: `Salida en ${formatearTiempo(minutosHastaSalida)}`
            };
        }
    } catch (error) {
        return {
            estado: 'a-tiempo',
            descripcion: 'Estado desconocido'
        };
    }
}

// Función auxiliar para formatear tiempo en formato legible
function formatearTiempo(minutos) {
    if (minutos < 60) {
        return `${minutos} min`;
    } else if (minutos < 1440) { // menos de 24 horas
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
    } else {
        const dias = Math.floor(minutos / 1440);
        const horas = Math.floor((minutos % 1440) / 60);
        return horas > 0 ? `${dias}d ${horas}h` : `${dias}d`;
    }
}

// Función para actualizar estados de vuelos en tiempo real
function actualizarEstadosEnTiempoReal() {
    const filas = document.querySelectorAll('#contenido_tabla tr');
    
    filas.forEach((fila, index) => {
        const celdas = fila.querySelectorAll('td');
        if (celdas.length >= 8) { // Verificar que es una fila de datos
            const fechaSalida = celdas[4].textContent.trim();
            const fechaLlegada = celdas[5].textContent.trim();
            
            // Convertir el formato de fecha mostrado de vuelta a formato procesable
            const fechaSalidaISO = convertirFechaVisualizacionAISO(fechaSalida);
            const fechaLlegadaISO = convertirFechaVisualizacionAISO(fechaLlegada);
            
            if (fechaSalidaISO && fechaLlegadaISO) {
                const estadoReal = calcularEstadoVuelo(fechaSalidaISO, fechaLlegadaISO);
                const estadoTexto = {
                    'a-tiempo': 'A tiempo',
                    'embarcando': 'Embarcando',
                    'despego': 'Despegó',
                    'llego': 'Llegó'
                };
                
                // Actualizar el estado en la celda correspondiente
                const celdaEstado = celdas[6];
                const spanEstado = celdaEstado.querySelector('.flight-status');
                if (spanEstado) {
                    spanEstado.className = `flight-status status-${estadoReal}`;
                    spanEstado.textContent = estadoTexto[estadoReal];
                }
            }
        }
    });
}

// Función auxiliar para convertir fecha de visualización a formato ISO
function convertirFechaVisualizacionAISO(fechaTexto) {
    try {
        // Formato esperado: "DD/MM/YYYY HH:MM"
        const partes = fechaTexto.split(' ');
        if (partes.length === 2) {
            const [dia, mes, año] = partes[0].split('/');
            const hora = partes[1];
            return `${año}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T${hora}:00`;
        }
        return null;
    } catch (error) {
        return null;
    }
}

// Inicializar actualización automática de estados cada minuto
let intervalActualizacion;

function iniciarActualizacionEstados() {
    // Actualizar inmediatamente
    actualizarEstadosEnTiempoReal();
    
    // Configurar actualización cada minuto
    if (intervalActualizacion) {
        clearInterval(intervalActualizacion);
    }
    
    intervalActualizacion = setInterval(() => {
        actualizarEstadosEnTiempoReal();
    }, 60000); // 60 segundos
}

function detenerActualizacionEstados() {
    if (intervalActualizacion) {
        clearInterval(intervalActualizacion);
        intervalActualizacion = null;
    }
}

// Modificar la función cargarVuelos para incluir actualización automática
function cargarVuelos() {
    fetch("http://localhost:9999/consulta_vuelos?origen=*&destino=*", {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then(res => res.text())
    .then(json => {
        const vuelos = JSON.parse(json);
        mostrarVuelos(vuelos);
        actualizarEstadisticas(vuelos);
        
        // Iniciar actualización automática de estados
        iniciarActualizacionEstados();
    })
    .catch(e => {
        console.log('Error cargando vuelos: ' + e.message);
        mostrarError('Error al cargar vuelos');
    });
}

function eliminarVuelo(id) {
    if (confirm('¿Está seguro de que desea eliminar este vuelo?')) {
        fetch('http://localhost:9999/borrar_vuelo?id=' + id, {
            method: 'DELETE'
        })
        .then(res => res.text())
        .then(json => {
            cargarVuelos();
            cerrarDialogo();
            mostrarExito('Vuelo eliminado correctamente');
        })
        .catch(e => {
            console.log('Error eliminando vuelo: ' + e.message);
            mostrarError('Error al eliminar vuelo');
        });
    }
}

// Función para verificar si existe un vuelo con el mismo número
async function verificarVueloExistente(numeroVuelo) {
    try {
        const response = await fetch(`http://localhost:9999/verificar_vuelo?numeroVuelo=${numeroVuelo}`);
        const data = await response.json();
        return data.existe;
    } catch (e) {
        console.log('Error verificando vuelo: ' + e.message);
        return false;
    }
}

// Función para verificar vuelo en edición
async function verificarVueloEdicion(numeroVuelo, id) {
    try {
        const response = await fetch(`http://localhost:9999/verificar_vuelo_edicion?numeroVuelo=${numeroVuelo}&id=${id}`);
        const data = await response.json();
        return data.existe;
    } catch (e) {
        console.log('Error verificando vuelo para edición: ' + e.message);
        return false;
    }
}

async function edicionVuelo() {
    let id = document.getElementById('idVuelo').value;
    let numeroVuelo = document.getElementById('numeroVueloEdicion').value.trim();
    let origen = document.getElementById('origenEdicion').value.trim();
    let destino = document.getElementById('destinoEdicion').value.trim();
    let fechaSalida = document.getElementById('fechaSalidaEdicion').value;
    let fechaLlegada = document.getElementById('fechaLlegadaEdicion').value;

    if (!numeroVuelo || !origen || !destino || !fechaSalida || !fechaLlegada) {
        mostrarError('Por favor complete todos los campos');
        return;
    }

    // Validar que la fecha de llegada sea posterior a la de salida
    if (new Date(fechaLlegada) <= new Date(fechaSalida)) {
        mostrarError('La fecha de llegada debe ser posterior a la fecha de salida');
        return;
    }

    // Verificar si ya existe otro vuelo con ese número
    const existe = await verificarVueloEdicion(numeroVuelo, id);
    if (existe) {
        mostrarError(`Ya existe otro vuelo con el número: ${numeroVuelo}`);
        return;
    }

    // Convertir fechas al formato esperado por el backend
    const fechaSalidaFormatted = convertirFechaParaBackend(fechaSalida);
    const fechaLlegadaFormatted = convertirFechaParaBackend(fechaLlegada);

    fetch(`http://localhost:9999/editar_vuelo?id=${id}&numeroVuelo=${numeroVuelo}&origen=${origen}&destino=${destino}&fechaSalida=${fechaSalidaFormatted}&fechaLlegada=${fechaLlegadaFormatted}`, {
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
        cargarVuelos();
        cerrarDialogo();
        mostrarExito('Vuelo modificado correctamente');
    })
    .catch(e => {
        console.log('Error modificando vuelo: ' + e);
        mostrarError('Error al modificar vuelo: ' + e);
    });
}

function llamarDialogoVuelo() {
    const dialogoVuelo = document.getElementById('dialogoVuelo');
    if (dialogoVuelo) {
        // Limpiar campos
        document.getElementById('numeroVueloCreacion').value = '';
        document.getElementById('origenCreacion').value = '';
        document.getElementById('destinoCreacion').value = '';
        document.getElementById('fechaSalidaCreacion').value = '';
        document.getElementById('fechaLlegadaCreacion').value = '';
        dialogoVuelo.showModal();
    }
}

function llamarModificarVuelo(id, numeroVuelo, origen, destino, fechaSalida, fechaLlegada) {
    const dialogoVueloEdicion = document.getElementById('dialogoVueloEdicion');
    if (dialogoVueloEdicion) {
        // Llenar campos con datos existentes
        document.getElementById('idVuelo').value = id;
        document.getElementById('numeroVueloEdicion').value = numeroVuelo;
        document.getElementById('origenEdicion').value = origen;
        document.getElementById('destinoEdicion').value = destino;
        
        // Convertir fechas al formato datetime-local
        document.getElementById('fechaSalidaEdicion').value = convertirFechaParaInput(fechaSalida);
        document.getElementById('fechaLlegadaEdicion').value = convertirFechaParaInput(fechaLlegada);
        
        dialogoVueloEdicion.showModal();
    }
}

async function crearVuelo() {
    let numeroVuelo = document.getElementById('numeroVueloCreacion').value.trim();
    let origen = document.getElementById('origenCreacion').value.trim();
    let destino = document.getElementById('destinoCreacion').value.trim();
    let fechaSalida = document.getElementById('fechaSalidaCreacion').value;
    let fechaLlegada = document.getElementById('fechaLlegadaCreacion').value;
    
    if (!numeroVuelo || !origen || !destino || !fechaSalida || !fechaLlegada) {
        mostrarError('Por favor complete todos los campos');
        return;
    }

    // Validar que la fecha de llegada sea posterior a la de salida
    if (new Date(fechaLlegada) <= new Date(fechaSalida)) {
        mostrarError('La fecha de llegada debe ser posterior a la fecha de salida');
        return;
    }

    // Verificar si ya existe un vuelo con ese número
    const existe = await verificarVueloExistente(numeroVuelo);
    if (existe) {
        mostrarError(`Ya existe un vuelo con el número: ${numeroVuelo}`);
        return;
    }

    // Convertir fechas al formato esperado por el backend
    const fechaSalidaFormatted = convertirFechaParaBackend(fechaSalida);
    const fechaLlegadaFormatted = convertirFechaParaBackend(fechaLlegada);
    
    fetch(`http://localhost:9999/crear_vuelo?numeroVuelo=${numeroVuelo}&origen=${origen}&destino=${destino}&fechaSalida=${fechaSalidaFormatted}&fechaLlegada=${fechaLlegadaFormatted}`)
    .then(res => {
        if (res.ok) {
            return res.text();
        } else {
            return res.text().then(text => Promise.reject(text));
        }
    })
    .then(json => {
        cargarVuelos();
        cerrarDialogo();
        mostrarExito('Vuelo creado correctamente');
    })
    .catch(e => {
        console.log('Error creando vuelo: ' + e);
        mostrarError('Error al crear vuelo: ' + e);
    });
}

function cerrarDialogo() {
    const dialogoVuelo = document.getElementById('dialogoVuelo');
    const dialogoVueloEdicion = document.getElementById('dialogoVueloEdicion');
    
    if (dialogoVuelo) {
        dialogoVuelo.close();
    }
    if (dialogoVueloEdicion) {
        dialogoVueloEdicion.close();
    }
}

function actualizarEstadisticas(vuelos) {
    const totalVuelos = vuelos.length;
    
    // Simular vuelos de hoy (20% del total)
    const vuelosHoy = Math.ceil(totalVuelos * 0.2);
    
    // Simular vuelos activos (30% del total)
    const vuelosActivos = Math.ceil(totalVuelos * 0.3);
    
    // Calcular rutas únicas
    const rutasUnicas = new Set();
    vuelos.forEach(vuelo => {
        rutasUnicas.add(`${vuelo.origen}-${vuelo.destino}`);
    });
    
    document.getElementById('totalVuelos').textContent = totalVuelos;
    document.getElementById('vuelosHoy').textContent = vuelosHoy;
    document.getElementById('vuelosActivos').textContent = vuelosActivos;
    document.getElementById('rutasUnicas').textContent = rutasUnicas.size;
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

// Función para formatear fecha y hora
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

// Función para convertir fecha para el backend (formato Date de Java)
function convertirFechaParaBackend(fechaLocal) {
    try {
        const fecha = new Date(fechaLocal);
        return fecha.toISOString().split('T')[0]; // YYYY-MM-DD
    } catch (error) {
        return fechaLocal;
    }
}

// Función para convertir fecha para el input datetime-local
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

// Event listeners para cerrar modales con Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarDialogo();
    }
});

// Event listeners para cerrar modales al hacer clic fuera
document.getElementById('dialogoVuelo')?.addEventListener('click', function(event) {
    if (event.target === this) {
        cerrarDialogo();
    }
});

document.getElementById('dialogoVueloEdicion')?.addEventListener('click', function(event) {
    if (event.target === this) {
        cerrarDialogo();
    }
});

// Validación en tiempo real para evitar duplicados
document.getElementById('numeroVueloCreacion')?.addEventListener('blur', async function() {
    const numeroVuelo = this.value.trim();
    if (numeroVuelo) {
        const existe = await verificarVueloExistente(numeroVuelo);
        if (existe) {
            this.style.borderColor = '#e74c3c';
            mostrarError(`El número de vuelo ${numeroVuelo} ya existe`);
        } else {
            this.style.borderColor = '#2ecc71';
        }
    }
});

document.getElementById('numeroVueloEdicion')?.addEventListener('blur', async function() {
    const numeroVuelo = this.value.trim();
    const id = document.getElementById('idVuelo').value;
    if (numeroVuelo && id) {
        const existe = await verificarVueloEdicion(numeroVuelo, id);
        if (existe) {
            this.style.borderColor = '#e74c3c';
            mostrarError(`El número de vuelo ${numeroVuelo} ya existe`);
        } else {
            this.style.borderColor = '#2ecc71';
        }
    }
});

// Validación de fechas en tiempo real
document.getElementById('fechaLlegadaCreacion')?.addEventListener('change', function() {
    const fechaSalida = document.getElementById('fechaSalidaCreacion').value;
    const fechaLlegada = this.value;
    
    if (fechaSalida && fechaLlegada && new Date(fechaLlegada) <= new Date(fechaSalida)) {
        this.style.borderColor = '#e74c3c';
        mostrarError('La fecha de llegada debe ser posterior a la fecha de salida');
    } else {
        this.style.borderColor = '#2ecc71';
    }
});

document.getElementById('fechaLlegadaEdicion')?.addEventListener('change', function() {
    const fechaSalida = document.getElementById('fechaSalidaEdicion').value;
    const fechaLlegada = this.value;
    
    if (fechaSalida && fechaLlegada && new Date(fechaLlegada) <= new Date(fechaSalida)) {
        this.style.borderColor = '#e74c3c';
        mostrarError('La fecha de llegada debe ser posterior a la fecha de salida');
    } else {
        this.style.borderColor = '#2ecc71';
    }
});

// Limpiar intervalos cuando se abandona la página
window.addEventListener('beforeunload', function() {
    detenerActualizacionEstados();
});

// Limpiar intervalos cuando se navega a otra página
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        detenerActualizacionEstados();
    } else {
        // Reanudar actualización cuando se vuelve a la página
        setTimeout(() => {
            if (document.getElementById('contenido_tabla').children.length > 0) {
                iniciarActualizacionEstados();
            }
        }, 1000);
    }
});

// Función para mostrar información detallada del estado (opcional)
function mostrarInfoDetallada(elemento, fechaSalida, fechaLlegada) {
    const info = obtenerInfoEstadoVuelo(fechaSalida, fechaLlegada);
    elemento.setAttribute('title', info.descripcion);
    elemento.setAttribute('data-tooltip', info.descripcion);
}

// Función de debug para mostrar estados en consola
function debugEstados() {
    const filas = document.querySelectorAll('#contenido_tabla tr');
    console.log('=== ESTADO DE VUELOS ===');
    console.log('Hora actual:', new Date().toLocaleString('es-ES'));
    
    filas.forEach((fila, index) => {
        const celdas = fila.querySelectorAll('td');
        if (celdas.length >= 8) {
            const numeroVuelo = celdas[1].textContent.trim();
            const fechaSalida = celdas[4].textContent.trim();
            const fechaLlegada = celdas[5].textContent.trim();
            const estado = celdas[6].textContent.trim();
            
            console.log(`${numeroVuelo}: ${estado} | Salida: ${fechaSalida} | Llegada: ${fechaLlegada}`);
        }
    });
}

// Hacer disponible la función debug globalmente
window.debugEstados = debugEstados;

// Función para forzar actualización manual
function actualizarManual() {
    if (document.getElementById('contenido_tabla').children.length > 0) {
        actualizarEstadosEnTiempoReal();
        mostrarExito('Estados actualizados manualmente');
    }
}

// Hacer disponible la función de actualización manual
window.actualizarManual = actualizarManual;