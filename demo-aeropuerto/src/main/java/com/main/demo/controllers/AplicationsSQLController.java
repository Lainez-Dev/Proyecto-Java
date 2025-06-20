package com.main.demo.controllers;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.main.demo.services.Servicio;

@RestController 
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AplicationsSQLController {
	
	@Autowired
	private Servicio servicio;
	
	// ENDPOINTS DE BÚSQUEDA
	
	@GetMapping("/consulta_aerolineas")
	public ResponseEntity<?> buscarAerolineas(
			@RequestParam(required = false, defaultValue = "*") String nombre,
			@RequestParam(required = false, defaultValue = "*") String pais) {
		try {
			return ResponseEntity.ok().body(servicio.buscarAerolineasConFiltros(nombre, pais));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	// Endpoint mejorado para consultar vuelos con filtros opcionales
	@GetMapping("/consulta_vuelos")
	public ResponseEntity<?> buscarVuelos(
			@RequestParam(required = false, defaultValue = "*") String origen,
			@RequestParam(required = false, defaultValue = "*") String destino,
			@RequestParam(required = false, defaultValue = "*") String numeroVuelo) {
		try {
			return ResponseEntity.ok().body(servicio.buscarVuelosConFiltros(origen, destino, numeroVuelo));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}

	// Endpoint para verificar si existe un vuelo
	@GetMapping("/verificar_vuelo")
	public ResponseEntity<?> verificarVuelo(@RequestParam String numeroVuelo) {
		try {
			boolean existe = servicio.existeVuelo(numeroVuelo);
			return ResponseEntity.ok().body("{\"existe\": " + existe + "}");
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	// Endpoint para verificar vuelo en edición
	@GetMapping("/verificar_vuelo_edicion")
	public ResponseEntity<?> verificarVueloEdicion(
			@RequestParam String numeroVuelo, 
			@RequestParam Integer id) {
		try {
			boolean existe = servicio.existeVueloParaEdicion(numeroVuelo, id);
			return ResponseEntity.ok().body("{\"existe\": " + existe + "}");
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@GetMapping("/consulta_pasajeros")
	public ResponseEntity<?> buscarPasajeros(@RequestParam String dni){
		try {
			return ResponseEntity.ok().body(servicio.buscarPasajeros(dni));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	@GetMapping("/consulta_equipajes")
	public ResponseEntity<?> buscarEquipajesPorPasajero(@RequestParam Integer idPasajero){
		try {
			return ResponseEntity.ok().body(servicio.buscarEquipajesPorPasajero(idPasajero));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	@GetMapping("/consulta_reservas")
	public ResponseEntity<?> buscarReservasPorPasajero(@RequestParam Integer idPasajero){
		try {
			return ResponseEntity.ok().body(servicio.buscarReservasPorPasajero(idPasajero));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}

	@GetMapping("/consulta_reservas_todas")
	public ResponseEntity<?> buscarTodasLasReservas() {
		try {
			return ResponseEntity.ok().body(servicio.buscarTodasLasReservas());
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}

	@GetMapping("/consulta_reservas_filtros")
	public ResponseEntity<?> buscarReservasConFiltros(
			@RequestParam(required = false, defaultValue = "*") String idPasajero,
			@RequestParam(required = false, defaultValue = "*") String idVuelo,
			@RequestParam(required = false, defaultValue = "*") String fecha) {
		try {
			return ResponseEntity.ok().body(servicio.buscarReservasConFiltros(idPasajero, idVuelo, fecha));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}

	@GetMapping("/verificar_reserva")
	public ResponseEntity<?> verificarReserva(
			@RequestParam Integer idPasajero,
			@RequestParam Integer idVuelo) {
		try {
			boolean existe = servicio.existeReserva(idPasajero, idVuelo);
			return ResponseEntity.ok().body("{\"existe\": " + existe + "}");
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@GetMapping("/verificar_reserva_edicion")
	public ResponseEntity<?> verificarReservaEdicion(
			@RequestParam Integer idPasajero,
			@RequestParam Integer idVuelo,
			@RequestParam Integer id) {
		try {
			boolean existe = servicio.existeReservaParaEdicion(idPasajero, idVuelo, id);
			return ResponseEntity.ok().body("{\"existe\": " + existe + "}");
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@GetMapping("/consulta_puertas")
	public ResponseEntity<?> buscarPuertas(
			@RequestParam(required = false, defaultValue = "*") String numeroPuerta,
			@RequestParam(required = false, defaultValue = "*") String terminal) {
		try {
			return ResponseEntity.ok().body(servicio.buscarPuertasConFiltros(numeroPuerta, terminal));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	@GetMapping("/consulta_aviones_todos")
	public ResponseEntity<?> buscarTodosLosAviones() {
		try {
			return ResponseEntity.ok().body(servicio.buscarTodosLosAviones());
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}

	// Endpoint mejorado para consultar aviones con filtros
	@GetMapping("/consulta_aviones")
	public ResponseEntity<?> buscarAvionesConFiltros(
			@RequestParam(required = false, defaultValue = "*") String modelo,
			@RequestParam(required = false, defaultValue = "*") String idAerolinea,
			@RequestParam(required = false, defaultValue = "0") String capacidadMinima) {
		try {
			return ResponseEntity.ok().body(servicio.buscarAvionesConFiltros(modelo, idAerolinea, capacidadMinima));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	
	// ENDPOINTS DE CREACIÓN
	
	@GetMapping("/crear_aerolinea")
	public ResponseEntity<?> crearAerolinea(@RequestParam String nombre,
			@RequestParam String paisOrigen){
		try {
			return ResponseEntity.ok().body(servicio.crearAerolinea(nombre, paisOrigen));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	@GetMapping("/crear_avion")
	public ResponseEntity<?> crearAvion(@RequestParam String modelo,
			@RequestParam Integer capacidadAsientos,
			@RequestParam Integer idAerolinea,
			@RequestParam(required = false) Integer idVuelo){
		try {
			// Validaciones
			if (modelo == null || modelo.trim().isEmpty()) {
				return ResponseEntity.badRequest().body("El modelo es obligatorio");
			}
			if (capacidadAsientos < 1 || capacidadAsientos > 1000) {
				return ResponseEntity.badRequest().body("La capacidad debe estar entre 1 y 1000 asientos");
			}
			
			return ResponseEntity.ok().body(servicio.crearAvion(modelo, capacidadAsientos, idAerolinea, idVuelo));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	@GetMapping("/crear_equipaje")
	public ResponseEntity<?> crearEquipaje(@RequestParam Integer idPasajero,
			@RequestParam String descripcion,
			@RequestParam BigDecimal peso){
		try {
			return ResponseEntity.ok().body(servicio.crearEquipaje(idPasajero, descripcion, peso));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	@GetMapping("/crear_pasajero")
	public ResponseEntity<?> crearPasajero(@RequestParam String nombre,
			@RequestParam String apellido,
			@RequestParam String dni,
			@RequestParam Date fechaNacimiento,
			@RequestParam String email){
		try {
			return ResponseEntity.ok().body(servicio.crearPasajero(nombre, apellido, dni, fechaNacimiento, email));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	@GetMapping("/crear_puerta")
	public ResponseEntity<?> crearPuerta(@RequestParam String numeroPuerta,
			@RequestParam String terminal){
		try {
			return ResponseEntity.ok().body(servicio.crearPuerta(numeroPuerta, terminal));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	@GetMapping("/crear_reserva")
	public ResponseEntity<?> crearReserva(@RequestParam Integer idPasajero,
			@RequestParam Integer idVuelo,
			@RequestParam String fechaReserva){
		try {
			// Convertir string de fecha a Date
			Date fechaReservaDate;
			try {
				// Intentar formato YYYY-MM-DD
				fechaReservaDate = Date.valueOf(fechaReserva);
			} catch (IllegalArgumentException e) {
				try {
					// Intentar formato con timestamp
					DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
					LocalDateTime dateTime = LocalDateTime.parse(fechaReserva, formatter);
					fechaReservaDate = Date.valueOf(dateTime.toLocalDate());
				} catch (DateTimeParseException e2) {
					return ResponseEntity.badRequest().body("Formato de fecha inválido. Use YYYY-MM-DD o YYYY-MM-DD HH:mm:ss");
				}
			}
			
			return ResponseEntity.ok().body(servicio.crearReserva(idPasajero, idVuelo, fechaReservaDate));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	@GetMapping("/crear_vuelo")
	public ResponseEntity<?> crearVuelo(@RequestParam String numeroVuelo,
			@RequestParam String origen,
			@RequestParam String destino,
			@RequestParam String fechaSalida,
			@RequestParam String fechaLlegada){
		try {
			// Convertir strings de fecha a Date
			Date fechaSalidaDate = Date.valueOf(fechaSalida);
			Date fechaLlegadaDate = Date.valueOf(fechaLlegada);
			
			// Validar que la fecha de llegada sea posterior a la de salida
			if (fechaLlegadaDate.before(fechaSalidaDate) || fechaLlegadaDate.equals(fechaSalidaDate)) {
				return ResponseEntity.badRequest().body("La fecha de llegada debe ser posterior a la fecha de salida");
			}
			
			return ResponseEntity.ok().body(servicio.crearVuelo(numeroVuelo, origen, destino, fechaSalidaDate, fechaLlegadaDate));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body("Formato de fecha inválido. Use YYYY-MM-DD");
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	// ENDPOINTS DE EDICIÓN
	
	@PutMapping("/editar_aerolinea")
	public ResponseEntity<?> editarAerolinea(@RequestParam Integer id,
			@RequestParam String nombre,
			@RequestParam String paisOrigen){
		try {
			return ResponseEntity.ok().body(servicio.editarAerolinea(id, nombre, paisOrigen));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}

	// Endpoint para verificar si existe una aerolínea
	@GetMapping("/verificar_aerolinea")
	public ResponseEntity<?> verificarAerolinea(@RequestParam String nombre) {
		try {
			boolean existe = servicio.existeAerolinea(nombre);
			return ResponseEntity.ok().body("{\"existe\": " + existe + "}");
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	// Endpoint para verificar aerolínea en edición
	@GetMapping("/verificar_aerolinea_edicion")
	public ResponseEntity<?> verificarAerolineaEdicion(
			@RequestParam String nombre, 
			@RequestParam Integer id) {
		try {
			boolean existe = servicio.existeAerolineaParaEdicion(nombre, id);
			return ResponseEntity.ok().body("{\"existe\": " + existe + "}");
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@PutMapping("/editar_avion")
	public ResponseEntity<?> editarAvion(@RequestParam Integer id,
			@RequestParam String modelo,
			@RequestParam Integer capacidadAsientos,
			@RequestParam Integer idAerolinea,
			@RequestParam(required = false) Integer idVuelo){
		try {
			// Validaciones
			if (modelo == null || modelo.trim().isEmpty()) {
				return ResponseEntity.badRequest().body("El modelo es obligatorio");
			}
			if (capacidadAsientos < 1 || capacidadAsientos > 1000) {
				return ResponseEntity.badRequest().body("La capacidad debe estar entre 1 y 1000 asientos");
			}
			
			return ResponseEntity.ok().body(servicio.editarAvion(id, modelo, capacidadAsientos, idAerolinea, idVuelo));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	@PutMapping("/editar_equipaje")
	public ResponseEntity<?> editarEquipaje(@RequestParam Integer id,
			@RequestParam Integer idPasajero,
			@RequestParam String descripcion,
			@RequestParam BigDecimal peso){
		try {
			return ResponseEntity.ok().body(servicio.editarEquipaje(id, idPasajero, descripcion, peso));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	@PutMapping("/editar_pasajero")
	public ResponseEntity<?> editarPasajero(@RequestParam Integer id,
			@RequestParam String nombre,
			@RequestParam String apellido,
			@RequestParam String dni,
			@RequestParam Date fechaNacimiento,
			@RequestParam String email){
		try {
			return ResponseEntity.ok().body(servicio.editarPasajero(id, nombre, apellido, dni, fechaNacimiento, email));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	@PutMapping("/editar_puerta")
	public ResponseEntity<?> editarPuerta(@RequestParam Integer id,
			@RequestParam String numeroPuerta,
			@RequestParam String terminal){
		try {
			return ResponseEntity.ok().body(servicio.editarPuerta(id, numeroPuerta, terminal));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	@PutMapping("/editar_reserva")
	public ResponseEntity<?> editarReserva(@RequestParam Integer id,
			@RequestParam Integer idPasajero,
			@RequestParam Integer idVuelo,
			@RequestParam String fechaReserva){
		try {
			// Convertir string de fecha a Date
			Date fechaReservaDate;
			try {
				// Intentar formato YYYY-MM-DD
				fechaReservaDate = Date.valueOf(fechaReserva);
			} catch (IllegalArgumentException e) {
				try {
					// Intentar formato con timestamp
					DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
					LocalDateTime dateTime = LocalDateTime.parse(fechaReserva, formatter);
					fechaReservaDate = Date.valueOf(dateTime.toLocalDate());
				} catch (DateTimeParseException e2) {
					return ResponseEntity.badRequest().body("Formato de fecha inválido. Use YYYY-MM-DD o YYYY-MM-DD HH:mm:ss");
				}
			}
			
			// Verificar si ya existe otra reserva con la misma combinación (excluyendo la actual)
			if (servicio.existeReservaParaEdicion(idPasajero, idVuelo, id)) {
				return ResponseEntity.badRequest().body("Ya existe otra reserva para este pasajero en este vuelo");
			}
			
			return ResponseEntity.ok().body(servicio.editarReserva(id, idPasajero, idVuelo, fechaReservaDate));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}

	@GetMapping("/estadisticas_reservas")
	public ResponseEntity<?> obtenerEstadisticasReservas() {
		try {
			Map<String, Object> estadisticas = new HashMap<>();
			
			// Obtener todas las reservas
			List<Reserva> todasLasReservas = servicio.buscarTodasLasReservas();
			estadisticas.put("totalReservas", todasLasReservas.size());
			
			// Calcular reservas de hoy
			LocalDate hoy = LocalDate.now();
			long reservasHoy = todasLasReservas.stream()
				.filter(r -> {
					LocalDate fechaReserva = r.getFechaReserva().toInstant()
						.atZone(ZoneId.systemDefault()).toLocalDate();
					return fechaReserva.equals(hoy);
				})
				.count();
			estadisticas.put("reservasHoy", reservasHoy);
			
			// Simular reservas confirmadas (80% del total)
			estadisticas.put("reservasConfirmadas", Math.ceil(todasLasReservas.size() * 0.8));
			
			// Calcular pasajeros únicos con reserva
			Set<Integer> pasajerosUnicos = todasLasReservas.stream()
				.map(Reserva::getIdPasajero)
				.collect(Collectors.toSet());
			estadisticas.put("pasajerosConReserva", pasajerosUnicos.size());
			
			return ResponseEntity.ok().body(estadisticas);
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@PutMapping("/editar_vuelo")
	public ResponseEntity<?> editarVuelo(@RequestParam Integer id,
			@RequestParam String numeroVuelo,
			@RequestParam String origen,
			@RequestParam String destino,
			@RequestParam String fechaSalida,
			@RequestParam String fechaLlegada){
		try {
			// Convertir strings de fecha a Date
			Date fechaSalidaDate = Date.valueOf(fechaSalida);
			Date fechaLlegadaDate = Date.valueOf(fechaLlegada);
			
			// Validar que la fecha de llegada sea posterior a la de salida
			if (fechaLlegadaDate.before(fechaSalidaDate) || fechaLlegadaDate.equals(fechaSalidaDate)) {
				return ResponseEntity.badRequest().body("La fecha de llegada debe ser posterior a la fecha de salida");
			}
			
			return ResponseEntity.ok().body(servicio.editarVuelo(id, numeroVuelo, origen, destino, fechaSalidaDate, fechaLlegadaDate));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body("Formato de fecha inválido. Use YYYY-MM-DD");
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	// ENDPOINTS DE ELIMINACIÓN
	
	@DeleteMapping("/borrar_aerolinea")
	public ResponseEntity<?> borrarAerolinea(@RequestParam Integer id){
		try {
			return ResponseEntity.ok().body(servicio.borrarAerolinea(id));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@DeleteMapping("/borrar_avion")
	public ResponseEntity<?> eliminarAvion(@RequestParam Integer id) {
		try {
			boolean eliminado = servicio.eliminarAvion(id);
			if (eliminado) {
				return ResponseEntity.ok().body("Avión eliminado correctamente");
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Avión no encontrado");
			}
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@GetMapping("/consulta_avion_por_id")
	public ResponseEntity<?> buscarAvionPorId(@RequestParam Integer id) {
		try {
			Avion avion = servicio.buscarAvionPorId(id);
			if (avion != null) {
				return ResponseEntity.ok().body(avion);
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Avión no encontrado");
			}
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	// Endpoint para verificar si un avión tiene vuelo asignado
	@GetMapping("/verificar_avion_vuelo")
	public ResponseEntity<?> verificarAvionVuelo(@RequestParam Integer idAvion) {
		try {
			boolean tieneVuelo = servicio.avionTieneVueloAsignado(idAvion);
			return ResponseEntity.ok().body("{\"tieneVuelo\": " + tieneVuelo + "}");
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	// Endpoint para obtener estadísticas de aviones
	@GetMapping("/estadisticas_aviones")
	public ResponseEntity<?> obtenerEstadisticasAviones() {
		try {
			return ResponseEntity.ok().body(servicio.obtenerEstadisticasAviones());
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@DeleteMapping("/borrar_equipaje")
	public ResponseEntity<?> borrarEquipaje(@RequestParam Integer id){
		try {
			return ResponseEntity.ok().body(servicio.borrarEquipaje(id));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@DeleteMapping("/borrar_pasajero")
	public ResponseEntity<?> borrarPasajero(@RequestParam String dni){
		try {
			return ResponseEntity.ok().body(servicio.borrarPasajero(dni));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@DeleteMapping("/borrar_puerta")
	public ResponseEntity<?> borrarPuerta(@RequestParam Integer id){
		try {
			return ResponseEntity.ok().body(servicio.borrarPuerta(id));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@DeleteMapping("/borrar_reserva")
	public ResponseEntity<?> borrarReserva(@RequestParam Integer id){
		try {
			return ResponseEntity.ok().body(servicio.borrarReserva(id));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@DeleteMapping("/borrar_vuelo")
	public ResponseEntity<?> borrarVuelo(@RequestParam Integer id){
		try {
			return ResponseEntity.ok().body(servicio.borrarVuelo(id));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@GetMapping("/verificar_puerta")
	public ResponseEntity<?> verificarPuerta(@RequestParam String numeroPuerta) {
		try {
			boolean existe = servicio.existePuerta(numeroPuerta);
			return ResponseEntity.ok().body("{\"existe\": " + existe + "}");
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@GetMapping("/verificar_puerta_edicion")
	public ResponseEntity<?> verificarPuertaEdicion(
			@RequestParam String numeroPuerta, 
			@RequestParam Integer id) {
		try {
			boolean existe = servicio.existePuertaParaEdicion(numeroPuerta, id);
			return ResponseEntity.ok().body("{\"existe\": " + existe + "}");
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	// Endpoint para obtener estadísticas del dashboard
	@GetMapping("/estadisticas_dashboard")
	public ResponseEntity<?> obtenerEstadisticasDashboard() {
		try {
			Map<String, Object> estadisticas = new HashMap<>();
			
			// Contar pasajeros
			List<Pasajero> pasajeros = servicio.buscarPasajeros("*");
			estadisticas.put("totalPasajeros", pasajeros.size());
			
			// Contar puertas
			List<Puerta> puertas = servicio.buscarPuertas();
			estadisticas.put("totalPuertas", puertas.size());
			
			// Contar aerolíneas
			List<Aerolinea> aerolineas = servicio.buscarAerolineas("*");
			estadisticas.put("totalAerolineas", aerolineas.size());
			
			// Estadísticas adicionales (simuladas por ahora)
			estadisticas.put("totalVuelos", 15);
			estadisticas.put("vuelosHoy", 8);
			estadisticas.put("puertasDisponibles", Math.max(0, puertas.size() - (puertas.size() / 3)));
			estadisticas.put("reservasActivas", 42);
			
			return ResponseEntity.ok().body(estadisticas);
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	// Endpoint para obtener actividad reciente
	@GetMapping("/actividad_reciente")
	public ResponseEntity<?> obtenerActividadReciente() {
		try {
			List<Map<String, Object>> actividades = new ArrayList<>();
			
			// Obtener algunos pasajeros recientes (últimos 5)
			List<Pasajero> pasajerosRecientes = servicio.buscarPasajeros("*");
			for (int i = 0; i < Math.min(3, pasajerosRecientes.size()); i++) {
				Pasajero p = pasajerosRecientes.get(i);
				Map<String, Object> actividad = new HashMap<>();
				actividad.put("tipo", "pasajero");
				actividad.put("titulo", "Pasajero registrado: " + p.getNombre() + " " + p.getApellido());
				actividad.put("tiempo", "Hace " + (i + 1) * 15 + " minutos");
				actividad.put("icono", "fas fa-user-plus");
				actividades.add(actividad);
			}
			
			// Obtener algunas puertas recientes
			List<Puerta> puertasRecientes = servicio.buscarPuertas();
			for (int i = 0; i < Math.min(2, puertasRecientes.size()); i++) {
				Puerta p = puertasRecientes.get(i);
				Map<String, Object> actividad = new HashMap<>();
				actividad.put("tipo", "puerta");
				actividad.put("titulo", "Puerta configurada: " + p.getNumeroPuerta() + " en " + p.getTerminal());
				actividad.put("tiempo", "Hace " + (i + 2) * 30 + " minutos");
				actividad.put("icono", "fas fa-door-open");
				actividades.add(actividad);
			}
			
			// Agregar algunas actividades simuladas
			Map<String, Object> actividadVuelo = new HashMap<>();
			actividadVuelo.put("tipo", "vuelo");
			actividadVuelo.put("titulo", "Vuelo IB2742 programado para salida");
			actividadVuelo.put("tiempo", "Hace 1 hora");
			actividadVuelo.put("icono", "fas fa-plane-departure");
			actividades.add(actividadVuelo);
			
			return ResponseEntity.ok().body(actividades);
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	// Endpoint para obtener el estado del sistema
	@GetMapping("/estado_sistema")
	public ResponseEntity<?> obtenerEstadoSistema() {
		try {
			Map<String, Object> estado = new HashMap<>();
			
			// Verificar conectividad de base de datos
			servicio.buscarPasajeros("*"); // Test de conexión
			
			// Obtener fecha y hora actual
			LocalDateTime ahora = LocalDateTime.now();
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
			
			estado.put("estadoGeneral", "✅ Sistema Activo");
			estado.put("baseDatos", "Conectada");
			estado.put("servicios", "Funcionando");
			estado.put("ultimaActualizacion", ahora.format(formatter));
			
			return ResponseEntity.ok().body(estado);
		} catch (Exception e) {
			Map<String, Object> estado = new HashMap<>();
			LocalDateTime ahora = LocalDateTime.now();
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
			
			estado.put("estadoGeneral", "❌ Error de Sistema");
			estado.put("baseDatos", "Error");
			estado.put("servicios", "Con problemas");
			estado.put("error", e.getMessage());
			estado.put("ultimaActualizacion", ahora.format(formatter));
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(estado);
		}
	}
	
	// MÉTODO AUXILIAR PARA PARSEAR DATETIME
	private Timestamp parseDateTime(String fechaString) throws DateTimeParseException {
		try {
			// Intentar formato completo: "yyyy-MM-dd HH:mm:ss"
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
			LocalDateTime dateTime = LocalDateTime.parse(fechaString, formatter);
			return Timestamp.valueOf(dateTime);
		} catch (DateTimeParseException e1) {
			try {
				// Intentar formato ISO: "yyyy-MM-ddTHH:mm:ss"
				LocalDateTime dateTime = LocalDateTime.parse(fechaString);
				return Timestamp.valueOf(dateTime);
			} catch (DateTimeParseException e2) {
				try {
					// Intentar formato solo fecha: "yyyy-MM-dd" (agregar hora por defecto)
					DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
					LocalDateTime dateTime = LocalDateTime.parse(fechaString + " 00:00:00", 
						DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
					return Timestamp.valueOf(dateTime);
				} catch (DateTimeParseException e3) {
					throw new DateTimeParseException("Formato de fecha no válido. Formatos aceptados: " +
						"'yyyy-MM-dd HH:mm:ss', 'yyyy-MM-ddTHH:mm:ss', 'yyyy-MM-dd'", fechaString, 0);
				}
			}
		}
	}
}