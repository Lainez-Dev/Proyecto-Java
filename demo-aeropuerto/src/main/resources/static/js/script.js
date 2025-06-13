document.addEventListener('DOMContentLoaded', function () {
    const flightsTableBody = document.querySelector('.flights-table tbody');

    async function fetchAndDisplayFlights() {
        if (!flightsTableBody) {
            console.error('Elemento tbody de la tabla de vuelos no encontrado.');
            return;
        }

        try {
            // Hacemos la petición con origen y destino vacíos para intentar obtener todos los vuelos
            // o al menos una base para filtrar.
            const response = await fetch('/consulta_vuelos?origen=&destino=');
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const allFlights = await response.json();

            if (!allFlights || allFlights.length === 0) {
                flightsTableBody.innerHTML = '<tr><td colspan="5">No hay vuelos disponibles.</td></tr>';
                return;
            }

            // 1. Obtener la fecha de hoy en formato YYYY-MM-DD
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses son 0-indexados
            const day = String(today.getDate()).padStart(2, '0');
            const todayString = `${year}-${month}-${day}`;

            // 2. Filtrar vuelos para hoy
            // La propiedad `fechaSalida` del backend es un java.sql.Date,
            // que Jackson serializa a "YYYY-MM-DD".
            const todaysFlights = allFlights.filter(flight => {
                // Asegurarse de que flight.fechaSalida existe y es un string
                return typeof flight.fechaSalida === 'string' && flight.fechaSalida.startsWith(todayString);
            });

            // 3. Ordenar los vuelos de hoy.
            // Dado que java.sql.Date no incluye hora, no podemos ordenar por hora de salida
            // a menos que el backend lo haga o tengamos otro campo.
            // Ordenaremos por numeroVuelo como fallback.
            // Si el backend ya los devuelve ordenados por algún criterio de tiempo, este sort puede no ser estrictamente necesario
            // o podría ajustarse si hubiera un campo de hora.
            todaysFlights.sort((a, b) => {
                if (a.numeroVuelo && b.numeroVuelo) {
                    return a.numeroVuelo.localeCompare(b.numeroVuelo);
                }
                return 0; // No sortear si falta numeroVuelo
            });

            // 4. Tomar los primeros 5 vuelos
            const top5Flights = todaysFlights.slice(0, 5);

            if (top5Flights.length === 0) {
                flightsTableBody.innerHTML = '<tr><td colspan="5">No hay vuelos programados para hoy.</td></tr>';
                return;
            }

            // 5. Llenar la tabla
            flightsTableBody.innerHTML = ''; // Limpiar contenido previo

            top5Flights.forEach(flight => {
                const tr = document.createElement('tr');

                // Formatear fechaSalida (que es YYYY-MM-DD) a DD/MM/YYYY
                let formattedSalida = 'N/A';
                if (flight.fechaSalida && typeof flight.fechaSalida === 'string') {
                    const parts = flight.fechaSalida.split('-'); // [YYYY, MM, DD]
                    if (parts.length === 3) {
                        formattedSalida = `${parts[2]}/${parts[1]}/${parts[0]}`;
                        // Nota: La columna "Salida" usualmente implica hora.
                        // Como java.sql.Date no la tiene, solo mostramos la fecha.
                        // Si se necesitara hora, el backend debería proveerla (e.g., campo LocalDateTime o Timestamp).
                    }
                }

                tr.innerHTML = `
                    <td>${flight.numeroVuelo || 'N/A'}</td>
                    <td>${flight.destino || 'N/A'}</td>
                    <td>${formattedSalida}</td>
                    <td>N/A</td> <!-- Puerta no está en el objeto Vuelo -->
                    <td>Programado</td> <!-- Estado no está en el objeto Vuelo -->
                `;
                flightsTableBody.appendChild(tr);
            });

        } catch (error) {
            console.error('Error al cargar los vuelos:', error);
            if (flightsTableBody) {
                flightsTableBody.innerHTML = `<tr><td colspan="5">Error al cargar los vuelos. ${error.message}</td></tr>`;
            }
        }
    }

    fetchAndDisplayFlights();
});