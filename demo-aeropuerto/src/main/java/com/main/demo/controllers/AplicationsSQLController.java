package com.main.demo.controllers;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.main.demo.services.Servicio;

@RestController
public class AplicationsSQLController {
	
	@Autowired
	private Servicio servicio;
	
	// ENDPOINTS DE BÚSQUEDA
	
	@GetMapping("/consulta_aerolineas")
	public ResponseEntity<?> buscarAerolineas(@RequestParam String nombre){
		try {
			return ResponseEntity.ok().body(servicio.buscarAerolineas(nombre));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	@GetMapping("/consulta_vuelos")
	public ResponseEntity<?> buscarVuelos(@RequestParam String origen,
			@RequestParam String destino){
		try {
			return ResponseEntity.ok().body(servicio.buscarVuelos(origen, destino));
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
	
	@GetMapping("/consulta_puertas")
	public ResponseEntity<?> buscarPuertas(){
		try {
			return ResponseEntity.ok().body(servicio.buscarPuertas());
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	@GetMapping("/consulta_aviones")
	public ResponseEntity<?> buscarAvionesPorAerolinea(@RequestParam Integer idAerolinea){
		try {
			return ResponseEntity.ok().body(servicio.buscarAvionesPorAerolinea(idAerolinea));
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
			@RequestParam Integer idVuelo){
		try {
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
			@RequestParam Date fechaReserva){
		try {
			return ResponseEntity.ok().body(servicio.crearReserva(idPasajero, idVuelo, fechaReserva));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	@GetMapping("/crear_vuelo")
	public ResponseEntity<?> crearVuelo(@RequestParam String numeroVuelo,
			@RequestParam String origen,
			@RequestParam String destino,
			@RequestParam Date fechaSalida,
			@RequestParam Date fechaLlegada){
		try {
			return ResponseEntity.ok().body(servicio.crearVuelo(numeroVuelo, origen, destino, fechaSalida, fechaLlegada));
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
	
	@PutMapping("/editar_avion")
	public ResponseEntity<?> editarAvion(@RequestParam Integer id,
			@RequestParam String modelo,
			@RequestParam Integer capacidadAsientos,
			@RequestParam Integer idAerolinea,
			@RequestParam Integer idVuelo){
		try {
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
			@RequestParam Date fechaReserva){
		try {
			return ResponseEntity.ok().body(servicio.editarReserva(id, idPasajero, idVuelo, fechaReserva));
		} catch (SQLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); 
		}
	}
	
	@PutMapping("/editar_vuelo")
	public ResponseEntity<?> editarVuelo(@RequestParam Integer id,
			@RequestParam String numeroVuelo,
			@RequestParam String origen,
			@RequestParam String destino,
			@RequestParam Date fechaSalida,
			@RequestParam Date fechaLlegada){
		try {
			return ResponseEntity.ok().body(servicio.editarVuelo(id, numeroVuelo, origen, destino, fechaSalida, fechaLlegada));
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
	public ResponseEntity<?> borrarAvion(@RequestParam Integer id){
		try {
			return ResponseEntity.ok().body(servicio.borrarAvion(id));
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
	public ResponseEntity<?> borrarPasajero(@RequestParam Integer id){
		try {
			return ResponseEntity.ok().body(servicio.borrarPasajero(id));
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
}