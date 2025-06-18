// Variables globales para almacenar datos
let datosGlobales = {
    vuelos: [],
    pasajeros: [],
    puertas: [],
    aerolineas: [],
    reservas: [],
    aviones: []
};

// Función principal para inicializar el dashboard
async function inicializarDashboard() {
    mostrarHoraActual();
    setInterval(mostrarHoraActual, 1000); // Actualizar cada segundo
    
    await cargarTodosDatos();
    actualizarEstadisticasGenerales();
    cargarActividad();
}

// Función para mostrar la hora actual
function mostrarHoraActual() {
    const ahora = new Date();
    const hora = ahora.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const elementoHora = document.getElementById('horaActual');
    if (elementoHora) {
        elementoHora.textContent = hora;
        elementoHora.classList.add('real-time-clock');
    }
}

// Función para cargar todos los datos del sistema
async function cargarTodosDatos() {
    try {
        document.getElementById('estatusGeneral').textContent = '🔄 Cargando...';
        
        // Cargar datos en paralelo
        const promesas = [
            cargarPasajeros(),
            cargarPuertas(),
            cargarAerolineas(),
            // cargarVuelos(), // Comentado porque no existe endpoint aún
            // cargarReservas(), // Comentado porque no existe endpoint aún
            // cargarAviones() // Comentado porque no existe endpoint aún
        ];
        
        await Promise.allSettled(promesas);
        
        document.getElementById('estatusGeneral').textContent = '✅ Sistema Activo';
        
    } catch (error) {
        console.error('Error cargando datos:', error);
        document.getElementById('estatusGeneral').textContent = '❌ Error de Sistema';
    }
}

// Función para cargar pasajeros
async function cargarPasajeros() {
    try {
        const response = await fetch('http://localhost:9999/consulta_pasajeros?dni=*');
        const data = await response.json();
        datosGlobales.pasajeros = data || [];
        
        mostrarPasajerosRecientes();
        
    } catch (error) {
        console.error('Error cargando pasajeros:', error);
        mostrarErrorPasajeros();
    }
}

// Función para cargar puertas
async function cargarPuertas() {
    try {
        const response = await fetch('http://localhost:9999/consulta_puertas?numeroPuerta=*&terminal=*');
        const data = await response.json();
        datosGlobales.puertas = data || [];
        
        mostrarEstadoPuertas();
        
    } catch (error) {
        console.error('Error cargando puertas:', error);
        mostrarErrorPuertas();
    }
}

// Función para cargar aerolíneas
async function cargarAerolineas() {
    try {
        const response = await fetch('http://localhost:9999/consulta_aerolineas?nombre=*');
        const data = await response.json();
        datosGlobales.aerolineas = data || [];
        
    } catch (error) {
        console.error('Error cargando aerolíneas:', error);
        datosGlobales.aerolineas = [];
    }
}

// Función para mostrar vuelos recientes (datos simulados hasta tener endpoint)
function mostrarVuelosRecientes() {
    const loading = document.getElementById('vuelosLoading');
    const content = document.getElementById('vuelosContent');
    const empty = document.getElementById('vuelosEmpty');
    const tbody = document.getElementById('vuelosTableBody');
    
    // Datos simulados de vuelos
    const vuelosSimulados = [
        { numeroVuelo: 'IB2742', origen: 'Madrid', destino: 'Barcelona', salida: '10:15', estado: 'on-time' },
        { numeroVuelo: 'BA8532', origen: 'Londres', destino: 'Madrid', salida: '11:00', estado: 'boarding' },
        { numeroVuelo: 'AF7721', origen: 'París', destino: 'Barcelona', salida: '11:45', estado: 'delayed' },
        { numeroVuelo: 'LH1823', origen: 'Frankfurt', destino: 'Madrid', salida: '12:30', estado: 'on-time' },
        { numeroVuelo: 'VY3421', origen: 'Madrid', destino: 'Valencia', salida: '13:15', estado: 'cancelled' }
    ];
    
    loading.style.display = 'none';
    
    if (vuelosSimulados.length > 0) {
        let filas = '';
        vuelosSimulados.slice(0, 5).forEach(vuelo => {
            const estadoTexto = {
                'on-time': 'A tiempo',
                'boarding': 'Embarcando',
                'delayed': 'Retrasado',
                'cancelled': 'Cancelado'
            };
            
            filas += `
                <tr>
                    <td><strong>${vuelo.numeroVuelo}</strong></td>
                    <td>${vuelo.origen}</td>
                    <td>${vuelo.destino}</td>
                    <td>${vuelo.salida}</td>
                    <td><span class="flight-status status-${vuelo.estado}">${estadoTexto[vuelo.estado]}</span></td>
                </tr>
            `;
        });
        
        tbody.innerHTML = filas;
        content.style.display = 'block';
    } else {
        empty.style.display = 'block';
    }
}

// Función para mostrar pasajeros recientes
function mostrarPasajerosRecientes() {
    const loading = document.getElementById('pasajerosLoading');
    const content = document.getElementById('pasajerosContent');
    const empty = document.getElementById('pasajerosEmpty');
    const listContent = document.getElementById('pasajerosListContent');
    
    loading.style.display = 'none';
    
    if (datosGlobales.pasajeros.length > 0) {
        let items = '';
        datosGlobales.pasajeros.slice(0, 6).forEach(pasajero => {
            const iniciales = `${pasajero.nombre.charAt(0)}${pasajero.apellido.charAt(0)}`;
            const fechaNacimiento = new Date(pasajero.fechaNacimiento).toLocaleDateString('es-ES');
            
            items += `
                <div class="passenger-preview-item">
                    <div class="passenger-avatar">${iniciales}</div>
                    <div class="passenger-info">
                        <h4>${pasajero.nombre} ${pasajero.apellido}</h4>
                        <p>DNI: ${pasajero.dni} • Nacido: ${fechaNacimiento}</p>
                    </div>
                </div>
            `;
        });
        
        listContent.innerHTML = items;
        content.style.display = 'block';
    } else {
        empty.style.display = 'block';
    }
}

// Función para mostrar estado de puertas
function mostrarEstadoPuertas() {
    const loading = document.getElementById('puertasLoading');
    const content = document.getElementById('puertasContent');
    const empty = document.getElementById('puertasEmpty');
    
    loading.style.display = 'none';
    
    if (datosGlobales.puertas.length > 0) {
        let items = '';
        datosGlobales.puertas.slice(0, 12).forEach(puerta => {
            // Estado simulado (en producción vendría de la base de datos)
            const estados = ['disponible', 'ocupada', 'mantenimiento'];
            const estadoAleatorio = estados[Math.floor(Math.random() * estados.length)];
            
            items += `
                <div class="puerta-preview ${estadoAleatorio}">
                    <strong>${puerta.numeroPuerta}</strong>
                    <small>${puerta.terminal}</small>
                </div>
            `;
        });
        
        content.innerHTML = items;
        content.style.display = 'block';
    } else {
        empty.style.display = 'block';
    }
}

// Función para mostrar errores en pasajeros
function mostrarErrorPasajeros() {
    const loading = document.getElementById('pasajerosLoading');
    const content = document.getElementById('pasajerosContent');
    
    loading.style.display = 'none';
    content.innerHTML = `
        <div class="empty-preview">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Error al cargar pasajeros</p>
            <button class="btn" onclick="cargarPasajeros()">Reintentar</button>
        </div>
    `;
    content.style.display = 'block';
}

// Función para mostrar errores en puertas
function mostrarErrorPuertas() {
    const loading = document.getElementById('puertasLoading');
    const content = document.getElementById('puertasContent');
    
    loading.style.display = 'none';
    content.innerHTML = `
        <div class="empty-preview">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Error al cargar puertas</p>
            <button class="btn" onclick="cargarPuertas()">Reintentar</button>
        </div>
    `;
    content.style.display = 'block';
}

// Función para actualizar estadísticas generales
function actualizarEstadisticasGenerales() {
    // Actualizar contadores
    document.getElementById('totalPasajeros').textContent = datosGlobales.pasajeros.length;
    document.getElementById('totalPuertas').textContent = datosGlobales.puertas.length;
    document.getElementById('totalAerolineas').textContent = datosGlobales.aerolineas.length;
    
    // Vuelos simulados
    document.getElementById('totalVuelos').textContent = '15';
    
    // Estadísticas adicionales
    const puertasDisponibles = Math.max(0, datosGlobales.puertas.length - Math.floor(datosGlobales.puertas.length * 0.3));
    document.getElementById('puertasDisponibles').textContent = `${puertasDisponibles} disponibles`;
    
    // Mostrar vuelos (simulados)
    mostrarVuelosRecientes();
}

// Función para cargar actividad reciente
function cargarActividad() {
    const activityList = document.getElementById('activityList');
    
    // Actividades simuladas basadas en datos reales y simulados
    const actividades = [
        {
            tipo: 'pasajero',
            titulo: `Nuevo pasajero registrado`,
            tiempo: 'Hace 5 minutos',
            icono: 'fas fa-user-plus'
        },
        {
            tipo: 'vuelo',
            titulo: 'Vuelo IB2742 programado para salida',
            tiempo: 'Hace 15 minutos',
            icono: 'fas fa-plane-departure'
        },
        {
            tipo: 'puerta',
            titulo: `Puerta A1 asignada a vuelo`,
            tiempo: 'Hace 30 minutos',
            icono: 'fas fa-door-open'
        },
        {
            tipo: 'pasajero',
            titulo: 'Check-in completado para 25 pasajeros',
            tiempo: 'Hace 45 minutos',
            icono: 'fas fa-check-circle'
        },
        {
            tipo: 'vuelo',
            titulo: 'Vuelo BA8532 en proceso de embarque',
            tiempo: 'Hace 1 hora',
            icono: 'fas fa-users'
        }
    ];
    
    // Agregar actividades basadas en datos reales
    if (datosGlobales.pasajeros.length > 0) {
        actividades.unshift({
            tipo: 'pasajero',
            titulo: `${datosGlobales.pasajeros.length} pasajeros en sistema`,
            tiempo: 'Actualizado ahora',
            icono: 'fas fa-users'
        });
    }
    
    if (datosGlobales.puertas.length > 0) {
        actividades.unshift({
            tipo: 'puerta',
            titulo: `${datosGlobales.puertas.length} puertas configuradas`,
            tiempo: 'Actualizado ahora',
            icono: 'fas fa-door-open'
        });
    }
    
    let items = '';
    actividades.slice(0, 8).forEach(actividad => {
        items += `
            <li class="activity-item">
                <div class="activity-icon ${actividad.tipo}">
                    <i class="${actividad.icono}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${actividad.titulo}</div>
                    <div class="activity-time">${actividad.tiempo}</div>
                </div>
            </li>
        `;
    });
    
    activityList.innerHTML = items;
}

// Función para refrescar datos
async function refrescarDatos() {
    await cargarTodosDatos();
    actualizarEstadisticasGenerales();
    cargarActividad();
    
    // Mostrar mensaje de éxito
    mostrarNotificacion('Datos actualizados correctamente', 'success');
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notification notification-${tipo}`;
    notificacion.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${mensaje}</span>
    `;
    
    // Estilos para la notificación
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? '#2ecc71' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notificacion);
    
    // Animar entrada
    setTimeout(() => {
        notificacion.style.opacity = '1';
        notificacion.style.transform = 'translateX(0)';
    }, 100);
    
    // Animar salida y eliminar
    setTimeout(() => {
        notificacion.style.opacity = '0';
        notificacion.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}

// Event listeners para acciones rápidas
document.addEventListener('DOMContentLoaded', function() {
    // Agregar funcionalidad de actualización automática cada 5 minutos
    setInterval(async () => {
        await cargarTodosDatos();
        actualizarEstadisticasGenerales();
    }, 300000); // 5 minutos
    
    // Agregar event listener para tecla de actualización (F5 o Ctrl+R personalizado)
    document.addEventListener('keydown', function(event) {
        if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
            event.preventDefault();
            refrescarDatos();
        }
    });
});

// Función para manejar errores de red
function manejarErrorRed(error) {
    console.error('Error de red:', error);
    mostrarNotificacion('Error de conexión con el servidor', 'error');
}

// Función para formatear fechas
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Función para formatear horas
function formatearHora(fecha) {
    return new Date(fecha).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
}
        //