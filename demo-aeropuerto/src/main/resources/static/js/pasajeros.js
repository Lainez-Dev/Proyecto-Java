function buscarPasajeros() {
    let nombre = document.getElementById('nombre').value;
    fetch("http://localhost:9999/consulta_Pasajeroes?nombre=" + nombre)
        .then(res => res.text())
        .then(json => {
            const posts = JSON.parse(json);
            let tabla = "";            
            posts.forEach(fila => {
                tabla += "<tr>";
                tabla += "<td>" + fila.id + "</td>";
                tabla += "<td>" + fila.nombre + "</td>";
                tabla += "<td>" + fila.fechaNacimiento + "</td>";
                tabla += "<td>" + fila.direccion + "</td>";   
                tabla += "<td>" + fila.dni + "</td>";
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

function eliminarPasajero(id) {
    fetch('http://localhost:9999/eliminar_Pasajero?idPasajero=' + id)
        .then(res => res.text())
        .then(json => {
            buscarPasajeroes();
            cerrarModificador();
        })
        .catch(e => {
            console.log('Error eliminando Pasajero: ' + e.message);
        });
}

function llamarModificarPasajero(id, nombre, fechaNacimiento, direccion, dni) {
    document.getElementById('idPasajero').value = id;
    document.getElementById('nombreModificacion').value = nombre;
    document.getElementById('fechaNacimientoMod').value = fechaNacimiento;
    document.getElementById('direccionMod').value = direccion;
    document.getElementById('dniMod').value = dni;
    // Asegurarse de que el elemento existe antes de modificarlo
    const modificador = document.getElementById('modificador');
    if (modificador) {
        modificador.style.display = "block";
    }
}

function modificarPasajero() {
    let id = document.getElementById('idPasajero').value;
    let nombre = document.getElementById('nombreModificacion').value;
    let fecha = document.getElementById('fechaNacimientoMod').value;
    let direccion = document.getElementById('direccionMod').value;
    let dni = document.getElementById('dniMod').value;
    
    fetch('http://localhost:9999/modificar_Pasajero?idPasajero=' + id + '&nombre=' + nombre + '&dni=' + dni + '&direccion=' + direccion + '&fechaNacimiento=' + fecha)
        .then(res => res.text())
        .then(json => {
            buscarPasajeroes();
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

function llamarDialogoLibro() {
    const dialogoLibro = document.getElementById('dialogoLibro');
    if (dialogoLibro) {
        dialogoLibro.style.display = "block";
    }
}

function crearLibro() {
    let titulo = document.getElementById('tituloCreacion').value;
    let descripcion = document.getElementById('descripcionCreacion').value;
    let fecha = document.getElementById('fechaCreacion').value;
    let favorito = document.getElementById('favoritoCreacion').value;
    let isbn = document.getElementById('isbnCreacion').value;
    let idioma = document.getElementById('idiomaCreacion').value;
    let categoria = document.getElementById('categoriaCreacion').value;
    let editorial = document.getElementById('editorialCreacion').value;
    
    // Corregido: añadida la URL del endpoint y los parámetros
    fetch('http://localhost:9999/crear_libro?titulo=' + titulo + '&descripcion=' + descripcion + '&fecha=' + fecha + '&favorito=' + favorito + '&isbn=' + isbn + '&idioma=' + idioma + '&categoria=' + categoria + '&editorial=' + editorial)
        .then(res => res.text())
        .then(json => {
            const dialogoLibro = document.getElementById('dialogoLibro');
            if (dialogoLibro) {
                dialogoLibro.style.display = "none";
            }
        })
        .catch(e => {
            console.log('Error creando libro: ' + e.message);
        });
}

function cerrarDialogo() {
    const dialogoPasajero = document.getElementById('dialogoPasajero');
    const dialogoLibro = document.getElementById('dialogoLibro');
    
    if (dialogoPasajero) {
        dialogoPasajero.style.display = "none";
    }
    if (dialogoLibro) {
        dialogoLibro.style.display = "none";
    }
}

function cerrarModificador() {
    document.getElementById('nombreModificacion').value = "";
    document.getElementById('fechaNacimientoMod').value = "";
    document.getElementById('direccionMod').value = "";
    document.getElementById('dniMod').value = "";
    
    const modificador = document.getElementById('modificador');
    if (modificador) {
        modificador.style.display = "none";
    }
}

function cargaInicial() {
    // Cargar editoriales
    let elementoSelect = document.getElementById('OpcionesEditorial');
    fetch("http://localhost:9999/buscar_editoriales")
        .then(res => res.text())
        .then(json => {
            const editoriales = JSON.parse(json);
            editoriales.forEach(editorial => {
                // Corregido: crear un nuevo elemento option para cada editorial
                let opt = document.createElement('option');
                opt.value = editorial.id;
                opt.text = editorial.nombre;
                elementoSelect.appendChild(opt);
            });
        })
        .catch(e => {
            console.log('Error cargando editoriales: ' + e.message);
        });
    
    // Cargar categorías
    let elementoSelect2 = document.getElementById('OpcionesCategoria');
    fetch("http://localhost:9999/buscar_categorias")
        .then(res => res.text())
        .then(json => {
            const categorias = JSON.parse(json);
            categorias.forEach(categoria => {
                // Corregido: crear un nuevo elemento option para cada categoría
                let opt = document.createElement('option');
                opt.value = categoria.id;
                opt.text = categoria.nombre;
                elementoSelect2.appendChild(opt);
            });
        })
        .catch(e => {
            console.log('Error cargando categorías: ' + e.message);
        });
}