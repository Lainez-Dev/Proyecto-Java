function buscarPuertas() {
    let numeroPuerta = document.getElementById('numeroPuerta').value || '*';
    let terminal = document.getElementById('terminal').value || '*';
    
    fetch(`http://localhost:9999/consulta_puertas?numeroPuerta=${numeroPuerta}&terminal=${terminal}`, {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then(res => res.text())
    .then(json => {
        const puertas = JSON.parse(json);
        mostrarPuertas(puertas);
    })
    .catch(e => {
        console.log('Error buscando puertas: ' + e.message);
        mostrarError('Error al buscar puertas');
    });
}

function cargarPuertas() {
    fetch("http://localhost:9999/consulta_puertas?numeroPuerta=*&terminal=*", {
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then(res => res.text())
    .then(json => {
        const puertas = JSON.parse(json);
        mostrarPuertas(puertas);
        actualizarEstadisticas(puertas);
    })
    .catch(e => {
        console.log('Error cargando puertas: ' + e.message);
        mostrarError('Error al cargar puertas');
    });
}

function mostrarPuertas(puertas) {
    let tabla = "";
    if (puertas && puertas.length > 0) {
        puertas.forEach(puerta => {
            tabla += "<tr>";
            tabla += "<td>" + puerta.id + "</td>";
            tabla += "<td>" + puerta.numeroPuerta + "</td>";
            tabla += "<td>" + puerta.terminal + "</td>";
            tabla += "<td class='table-actions'>";
            tabla += "<button class='btn btn-warning btn-sm' onclick=\"llamarModificarPuerta('" + puerta.id + "', '" + puerta.numeroPuerta + "', '" + puerta.terminal + "')\"><i class='fas fa-edit'></i> Modificar</button>";
            tabla += "<button class='btn btn-danger btn-sm' onclick=\"eliminarPuerta(" + puerta.id + ")\"><i class='fas fa-trash'></i> Eliminar</button>";
            tabla += "</td>";
            tabla += "</tr>";
        });
    } else {
        tabla = "<tr><td colspan='4' class='empty-state'><i class='fas fa-door-open'></i><h3>No hay puertas registradas</h3><p>Comience agregando una nueva puerta</p></td></tr>";
    }
    
    var contenedor_tabla = document.getElementById("contenido_tabla");
    contenedor_tabla.innerHTML = tabla;
}

function eliminarPuerta(id) {
    if (confirm('¿Está seguro de que desea eliminar esta puerta?')) {
        fetch('http://localhost:9999/borrar_puerta?id=' + id, {
            method: 'DELETE'
        })
        .then(res => res.text())
        .then(json => {
            cargarPuertas();
            cerrarDialogo();
            mostrarExito('Puerta eliminada correctamente');
        })
        .catch(e => {
            console.log('Error eliminando puerta: ' + e.message);
            mostrarError('Error al eliminar puerta');
        });
    }
}

// Función para verificar si existe una puerta
async function verificarPuertaExistente(numeroPuerta) {
    try {
        const response = await fetch(`http://localhost:9999/verificar_puerta?numeroPuerta=${numeroPuerta}`);
        const data = await response.json();
        return data.existe;
    } catch (e) {
        console.log('Error verificando puerta: ' + e.message);
        return false;
    }
}

// Función para verificar puerta en edición
async function verificarPuertaEdicion(numeroPuerta, id) {
    try {
        const response = await fetch(`http://localhost:9999/verificar_puerta_edicion?numeroPuerta=${numeroPuerta}&id=${id}`);
        const data = await response.json();
        return data.existe;
    } catch (e) {
        console.log('Error verificando puerta para edición: ' + e.message);
        return false;
    }
}

async function edicionPuerta() {
    let id = document.getElementById('idPuerta').value;
    let numeroPuerta = document.getElementById('numeroPuertaEdicion').value.trim();
    let terminal = document.getElementById('terminalEdicion').value.trim();

    if (!numeroPuerta || !terminal) {
        mostrarError('Por favor complete todos los campos');
        return;
    }

    // Verificar si ya existe otra puerta con ese número
    const existe = await verificarPuertaEdicion(numeroPuerta, id);
    if (existe) {
        mostrarError(`Ya existe otra puerta con el número: ${numeroPuerta}`);
        return;
    }

    fetch(`http://localhost:9999/editar_puerta?id=${id}&numeroPuerta=${numeroPuerta}&terminal=${terminal}`, {
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
        cargarPuertas();
        cerrarDialogo();
        mostrarExito('Puerta modificada correctamente');
    })
    .catch(e => {
        console.log('Error modificando puerta: ' + e);
        mostrarError('Error al modificar puerta: ' + e);
    });
}

function llamarDialogoPuerta() {
    const dialogoPuerta = document.getElementById('dialogoPuerta');
    if (dialogoPuerta) {
        // Limpiar campos
        document.getElementById('numeroPuertaCreacion').value = '';
        document.getElementById('terminalCreacion').value = '';
        dialogoPuerta.showModal();
    }
}

function llamarModificarPuerta(id, numeroPuerta, terminal) {
    const dialogoPuertaEdicion = document.getElementById('dialogoPuertaEdicion');
    if (dialogoPuertaEdicion) {
        // Llenar campos con datos existentes
        document.getElementById('idPuerta').value = id;
        document.getElementById('numeroPuertaEdicion').value = numeroPuerta;
        document.getElementById('terminalEdicion').value = terminal;
        dialogoPuertaEdicion.showModal();
    }
}

async function crearPuerta() {
    let numeroPuerta = document.getElementById('numeroPuertaCreacion').value.trim();
    let terminal = document.getElementById('terminalCreacion').value.trim();
    
    if (!numeroPuerta || !terminal) {
        mostrarError('Por favor complete todos los campos');
        return;
    }

    // Verificar si ya existe una puerta con ese número
    const existe = await verificarPuertaExistente(numeroPuerta);
    if (existe) {
        mostrarError(`Ya existe una puerta con el número: ${numeroPuerta}`);
        return;
    }
    
    fetch(`http://localhost:9999/crear_puerta?numeroPuerta=${numeroPuerta}&terminal=${terminal}`)
    .then(res => {
        if (res.ok) {
            return res.text();
        } else {
            return res.text().then(text => Promise.reject(text));
        }
    })
    .then(json => {
        cargarPuertas();
        cerrarDialogo();
        mostrarExito('Puerta creada correctamente');
    })
    .catch(e => {
        console.log('Error creando puerta: ' + e);
        mostrarError('Error al crear puerta: ' + e);
    });
}

function cerrarDialogo() {
    const dialogoPuerta = document.getElementById('dialogoPuerta');
    const dialogoPuertaEdicion = document.getElementById('dialogoPuertaEdicion');
    
    if (dialogoPuerta) {
        dialogoPuerta.close();
    }
    if (dialogoPuertaEdicion) {
        dialogoPuertaEdicion.close();
    }
}

function actualizarEstadisticas(puertas) {
    const totalPuertas = puertas.length;
    const terminalesUnicos = [...new Set(puertas.map(p => p.terminal))].length;
    
    document.getElementById('totalPuertas').textContent = totalPuertas;
    document.getElementById('puertasActivas').textContent = totalPuertas;
    document.getElementById('terminales').textContent = terminalesUnicos;
    document.getElementById('puertasOcupadas').textContent = '0'; // Esto se puede actualizar con datos reales
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
document.getElementById('dialogoPuerta')?.addEventListener('click', function(event) {
    if (event.target === this) {
        cerrarDialogo();
    }
});

document.getElementById('dialogoPuertaEdicion')?.addEventListener('click', function(event) {
    if (event.target === this) {
        cerrarDialogo();
    }
});

// Validación en tiempo real para evitar duplicados
document.getElementById('numeroPuertaCreacion')?.addEventListener('blur', async function() {
    const numeroPuerta = this.value.trim();
    if (numeroPuerta) {
        const existe = await verificarPuertaExistente(numeroPuerta);
        if (existe) {
            this.style.borderColor = '#e74c3c';
            mostrarError(`El número de puerta ${numeroPuerta} ya existe`);
        } else {
            this.style.borderColor = '#2ecc71';
        }
    }
});

document.getElementById('numeroPuertaEdicion')?.addEventListener('blur', async function() {
    const numeroPuerta = this.value.trim();
    const id = document.getElementById('idPuerta').value;
    if (numeroPuerta && id) {
        const existe = await verificarPuertaEdicion(numeroPuerta, id);
        if (existe) {
            this.style.borderColor = '#e74c3c';
            mostrarError(`El número de puerta ${numeroPuerta} ya existe`);
        } else {
            this.style.borderColor = '#2ecc71';
        }
    }
});// Esta parte del código se reemplaza completamente por la nueva versión