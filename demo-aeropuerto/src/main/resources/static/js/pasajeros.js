function buscarPasajeros() {
    let nombre = document.getElementById('nombre').value;
    fetch("http://localhost:9999/consulta_pasajeros?dni=" + dni, {headers: new Headers({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    })})
        .then(res => res.text())
        .then(json => {
            const posts = JSON.parse(json);
            let tabla = "";            
            posts.forEach(fila => {
                tabla += "<tr>";
                tabla += "<td>" + fila.id + "</td>";
                tabla += "<td>" + fila.nombre + "</td>";
                tabla += "<td>" + fila.apellido + "</td>";
                tabla += "<td>" + fila.fechaNacimiento + "</td>";
                tabla += "<td>" + fila.dni + "</td>";   
                tabla += "<td>" + fila.email + "</td>";
                // Corregida la sintaxis de las comillas y el onclick
                tabla += "<td><button onclick=\"llamarModificarPasajero('" + fila.id + "', '" + fila.nombre + "', '" + fila.fechaNacimiento + "', '" + fila.direccion + "', '" + fila.dni + "')\">Modificar</button><button onclick=\"eliminarPasajero(" + fila.id + ")\">Eliminar</button></td>";
                tabla += "</tr>";
            });
            var contenedor_tabla = document.getElementById("contenido_tabla");
            contenedor_tabla.innerHTML = tabla;
        })
        .catch(e => {
            console.log('Error importando archivo: ' + e.message);
        });
}

function eliminarPasajero(dni) {
    fetch('http://localhost:9999/borrar_pasajero?dni=' + dni)
        .then(res => res.text())
        .then(json => {
            buscarPasajeroes();
            cerrarModificador();
        })
        .catch(e => {
            console.log('Error eliminando Pasajero: ' + e.message);
        });
}

function edicionPasajero() {
    let id = document.getElementById('idPasajero').value;
    let nombre = document.getElementById('nombreEdicion').value;
    let apellido = document.getElementById('apellidoEdicion').value;
    let fecha = document.getElementById('fechaNacimientoEdicion').value;
    let dni = document.getElementById('dniEdicion').value;
    let email = document.getElementById('emailEdicion').value;

    fetch('http://localhost:9999/editar_pasajero?id='+id+'&nombre='+nombre+'&apellido='+apellido+'&dni='+dni+'&fechaNacimiento='+fecha+'&email='+email)
        .then(res => res.text())
        .then(json => {
            buscarPasajeros();
            cerrarModificador();
        })
        .catch(e => {
            console.log('Error modificando Pasajero: ' + e.message);
        });
}

function llamarDialogoPasajero() {
    const dialogoPasajero = document.getElementById('dialogoPasajero');
    if (dialogoPasajero) {
        dialogoPasajero.style.display = "block";
    }
}

function crearPasajero() {
    let nombre = document.getElementById('nombreCreacion').value;
    let apellido = document.getElementById('apellidoCreacion').value;
    let fechaNacimiento = document.getElementById('fechaNacimientoCreacion').value;
    let dni = document.getElementById('dniCreacion').value;
    let email = document.getElementById('emailCreacion').value;
    
    fetch('http://localhost:9999/crear_pasajero?nombre='+ nombre +'&apellido='+ apellido +'&dni='+ dni +'&fechaNacimiento='+ fechaNacimiento +'&email=' + email)
        .then(res => res.text())
        .then(json => {
            buscarPasajeroes();
            const dialogoPasajero = document.getElementById('dialogoPasajero');
            if (dialogoPasajero) {
                dialogoPasajero.style.display = "none";
            }
        })
        .catch(e => {
            console.log('Error creando Pasajero: ' + e.message);
        });
}

function llamarDialogoPasajeroEdicion() {
    const dialogoPasajeroEdicion = document.getElementById('dialogoPasajeroEdicion');
    if (dialogoPasajeroEdicion) {
        dialogoPasajeroEdicion.style.display = "block";
    }
}

function cerrarDialogo() {
    const dialogoPasajero = document.getElementById('dialogoPasajero');
    const dialogoPasajeroEdicion = document.getElementById('dialogoPasajeroEdicion');
    
    if (dialogoPasajero) {
        dialogoPasajero.style.display = "none";
    }
    if (dialogoPasajeroEdicion) {
        dialogoPasajeroEdicion.style.display = "none";
    }
}

function cargaInicial() {
    fetch("http://localhost:9999/consulta_pasajeros?dni=*")
        .then(res => res.text())
        .then(json => {
            const posts = JSON.parse(json);
            let tabla = "";            
            posts.forEach(fila => {
                tabla += "<tr>";
                tabla += "<td>" + fila.id + "</td>";
                tabla += "<td>" + fila.nombre + "</td>";
                tabla += "<td>" + fila.apellido + "</td>";
                tabla += "<td>" + fila.fechaNacimiento + "</td>";
                tabla += "<td>" + fila.dni + "</td>";   
                tabla += "<td>" + fila.email + "</td>";
                // Corregida la sintaxis de las comillas y el onclick
                tabla += "<td><button onclick=\"llamarModificarPasajero('" + fila.id + "', '" + fila.nombre + "', '" + fila.fechaNacimiento + "', '" + fila.direccion + "', '" + fila.dni + "')\">Modificar</button><button onclick=\"eliminarPasajero(" + fila.id + ")\">Eliminar</button></td>";
                tabla += "</tr>";
            });
            var contenedor_tabla = document.getElementById("contenido_tabla");
            contenedor_tabla.innerHTML = tabla;
        })
        .catch(e => {
            console.log('Error importando archivo: ' + e.message);
        });
}