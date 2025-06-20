package com.main.demo.services;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.main.demo.controllers.Aerolinea;
import com.main.demo.controllers.Avion;
import com.main.demo.controllers.Equipaje;
import com.main.demo.controllers.Pasajero;
import com.main.demo.controllers.Puerta;
import com.main.demo.controllers.Reserva;
import com.main.demo.controllers.Vuelo;

@Service
public class Servicio {

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    // MÉTODOS CREATE

    public Aerolinea crearAerolinea(String nombre, String paisOrigen) throws SQLException {
    // Verificar si ya existe una aerolínea con ese nombre
        if (existeAerolinea(nombre)) {
            throw new SQLException("Ya existe una aerolínea con el nombre: " + nombre);
        }
        
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "INSERT INTO aerolineas (nombre, pais_origen) VALUES(?,?)";
        PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
        ps.setString(1, nombre);
        ps.setString(2, paisOrigen);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Inserción de aerolínea correcta.");
            ResultSet rs = ps.getGeneratedKeys();
            Integer generatedId = null;
            if (rs.next()) {
                generatedId = rs.getInt(1);
            }
            rs.close();
            ps.close();
            conn.close();
            return new Aerolinea(generatedId, nombre, paisOrigen);
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido insertar la nueva aerolínea.");
        }
    }

    public String borrarReserva(Integer id) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "DELETE FROM reservas WHERE id = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setInt(1, id);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Eliminación de reserva correcta.");
            ps.close();
            conn.close();
            return "Reserva eliminada correctamente.";
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido eliminar la reserva.");
        }
    }

    public String borrarVuelo(Integer id) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "DELETE FROM vuelos WHERE id = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setInt(1, id);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Eliminación de vuelo correcta.");
            ps.close();
            conn.close();
            return "Vuelo eliminado correctamente.";
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido eliminar el vuelo.");
        }
    }

    public Avion crearAvion(String modelo, Integer capacidadAsientos, Integer idAerolinea, Integer idVuelo)
            throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "INSERT INTO aviones (modelo, capacidad_asientos, id_aerolinea, id_vuelo) VALUES(?,?,?,?)";
        PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
        ps.setString(1, modelo);
        ps.setInt(2, capacidadAsientos);
        ps.setInt(3, idAerolinea);
        ps.setInt(4, idVuelo);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Inserción de avión correcta.");
            ResultSet rs = ps.getGeneratedKeys();
            Integer generatedId = null;
            if (rs.next()) {
                generatedId = rs.getInt(1);
            }
            rs.close();
            ps.close();
            conn.close();
            return new Avion(generatedId, modelo, capacidadAsientos, idAerolinea, idVuelo);
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido insertar el nuevo avión.");
        }
    }

    public Equipaje crearEquipaje(Integer idPasajero, String descripcion, BigDecimal peso) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "INSERT INTO equipajes (id_pasajero, descripcion, peso) VALUES(?,?,?)";
        PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
        ps.setInt(1, idPasajero);
        ps.setString(2, descripcion);
        ps.setBigDecimal(3, peso);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Inserción de equipaje correcta.");
            ResultSet rs = ps.getGeneratedKeys();
            Integer generatedId = null;
            if (rs.next()) {
                generatedId = rs.getInt(1);
            }
            rs.close();
            ps.close();
            conn.close();
            return new Equipaje(generatedId, idPasajero, descripcion, peso);
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido insertar el nuevo equipaje.");
        }
    }

    public Pasajero crearPasajero(String nombre, String apellido, String dni, Date fechaNacimiento, String email)
            throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "INSERT INTO pasajeros (nombre, apellido, dni, fecha_nacimiento, email) VALUES(?,?,?,?,?)";
        PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
        ps.setString(1, nombre);
        ps.setString(2, apellido);
        ps.setString(3, dni);
        ps.setDate(4, fechaNacimiento);
        ps.setString(5, email);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Inserción de pasajero correcta.");
            ResultSet rs = ps.getGeneratedKeys();
            Integer generatedId = null;
            if (rs.next()) {
                generatedId = rs.getInt(1);
            }
            rs.close();
            ps.close();
            conn.close();
            return new Pasajero(generatedId, nombre, apellido, dni, fechaNacimiento, email);
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido insertar el nuevo pasajero.");
        }
    }

    public Puerta crearPuerta(String numeroPuerta, String terminal) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "INSERT INTO puertas (numero_puerta, terminal) VALUES(?,?)";
        PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
        ps.setString(1, numeroPuerta);
        ps.setString(2, terminal);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Inserción de puerta correcta.");
            ResultSet rs = ps.getGeneratedKeys();
            Integer generatedId = null;
            if (rs.next()) {
                generatedId = rs.getInt(1);
            }
            rs.close();
            ps.close();
            conn.close();
            return new Puerta(generatedId, numeroPuerta, terminal);
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido insertar la nueva puerta.");
        }
    }

    public Reserva crearReserva(Integer idPasajero, Integer idVuelo, Date fechaReserva) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "INSERT INTO reservas (id_pasajero, id_vuelo, fecha_reserva) VALUES(?,?,?)";
        PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
        ps.setInt(1, idPasajero);
        ps.setInt(2, idVuelo);
        ps.setTimestamp(3, new Timestamp(fechaReserva.getTime())); // Corrección: usar Timestamp para datetime

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Inserción de reserva correcta.");
            ResultSet rs = ps.getGeneratedKeys();
            Integer generatedId = null;
            if (rs.next()) {
                generatedId = rs.getInt(1);
            }
            rs.close();
            ps.close();
            conn.close();
            return new Reserva(generatedId, idPasajero, idVuelo, fechaReserva);
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido insertar la nueva reserva.");
        }
    }

    // CORRECCIÓN IMPORTANTE: Método crear vuelo con fechas datetime
    public Vuelo crearVuelo(String numeroVuelo, String origen, String destino, Timestamp fechaSalida, Timestamp fechaLlegada)
            throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "INSERT INTO vuelos (numero_vuelo, origen, destino, fecha_salida, fecha_llegada) VALUES(?,?,?,?,?)";
        PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
        ps.setString(1, numeroVuelo);
        ps.setString(2, origen);
        ps.setString(3, destino);
        ps.setTimestamp(4, fechaSalida); // Usar Timestamp para datetime
        ps.setTimestamp(5, fechaLlegada); // Usar Timestamp para datetime

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Inserción de vuelo correcta.");
            ResultSet rs = ps.getGeneratedKeys();
            Integer generatedId = null;
            if (rs.next()) {
                generatedId = rs.getInt(1);
            }
            rs.close();
            ps.close();
            conn.close();
            
            // Convertir Timestamp a LocalDateTime para el objeto Vuelo
            LocalDateTime fechaSalidaLDT = fechaSalida.toLocalDateTime();
            LocalDateTime fechaLlegadaLDT = fechaLlegada.toLocalDateTime();
            
            return new Vuelo(generatedId, numeroVuelo, origen, destino, fechaSalidaLDT, fechaLlegadaLDT);
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido insertar el nuevo vuelo.");
        }
    }

    // MÉTODOS DE BÚSQUEDA

    public List<Aerolinea> buscarAerolineas(String nombreBusqueda) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");
        String sql = "SELECT * FROM aerolineas WHERE nombre LIKE ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, "%" + nombreBusqueda + "%");

        ResultSet rs = ps.executeQuery();
        List<Aerolinea> aerolineas = new ArrayList<>();
        while (rs.next()) {
            Integer id = rs.getInt("id");
            String nombre = rs.getString("nombre");
            String paisOrigen = rs.getString("pais_origen");
            Aerolinea aerolinea = new Aerolinea(id, nombre, paisOrigen);
            aerolineas.add(aerolinea);
        }
        rs.close();
        ps.close();
        conn.close();
        return aerolineas;
    }

    public List<Aerolinea> buscarAerolineasConFiltros(String nombreBusqueda, String paisBusqueda) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");
        
        StringBuilder sql = new StringBuilder("SELECT * FROM aerolineas WHERE 1=1");
        List<String> parametros = new ArrayList<>();
        
        if (nombreBusqueda != null && !nombreBusqueda.equals("*") && !nombreBusqueda.trim().isEmpty()) {
            sql.append(" AND nombre LIKE ?");
            parametros.add("%" + nombreBusqueda + "%");
        }
        
        if (paisBusqueda != null && !paisBusqueda.equals("*") && !paisBusqueda.trim().isEmpty()) {
            sql.append(" AND pais_origen LIKE ?");
            parametros.add("%" + paisBusqueda + "%");
        }
        
        PreparedStatement ps = conn.prepareStatement(sql.toString());
        
        for (int i = 0; i < parametros.size(); i++) {
            ps.setString(i + 1, parametros.get(i));
        }
        
        ResultSet rs = ps.executeQuery();
        List<Aerolinea> aerolineas = new ArrayList<>();
        
        while (rs.next()) {
            Integer id = rs.getInt("id");
            String nombre = rs.getString("nombre");
            String paisOrigen = rs.getString("pais_origen");
            Aerolinea aerolinea = new Aerolinea(id, nombre, paisOrigen);
            aerolineas.add(aerolinea);
        }
        
        rs.close();
        ps.close();
        conn.close();
        return aerolineas;
    }

    public List<Pasajero> buscarPasajeros(String dniBusqueda) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");
        String sql;
        PreparedStatement ps;
        
        // Si dniBusqueda es "*" o está vacío, buscar todos los pasajeros
        if (dniBusqueda.equals("*") || dniBusqueda.trim().isEmpty()) {
            sql = "SELECT * FROM pasajeros";
            ps = conn.prepareStatement(sql);
        } else {
            sql = "SELECT * FROM pasajeros WHERE dni LIKE ?";
            ps = conn.prepareStatement(sql);
            ps.setString(1, "%" + dniBusqueda + "%");
        }

        ResultSet rs = ps.executeQuery();
        List<Pasajero> pasajeros = new ArrayList<>();
        while (rs.next()) {
            Integer id = rs.getInt("id");
            String nombre = rs.getString("nombre");
            String apellido = rs.getString("apellido");
            String dni = rs.getString("dni");
            Date fechaNacimiento = rs.getDate("fecha_nacimiento");
            String email = rs.getString("email");
            Pasajero pasajero = new Pasajero(id, nombre, apellido, dni, fechaNacimiento, email);
            pasajeros.add(pasajero);
        }
        rs.close();
        ps.close();
        conn.close();
        return pasajeros;
    }

    public List<Equipaje> buscarEquipajesPorPasajero(Integer idPasajero) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");
        String sql = "SELECT * FROM equipajes WHERE id_pasajero = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setInt(1, idPasajero);

        ResultSet rs = ps.executeQuery();
        List<Equipaje> equipajes = new ArrayList<>();
        while (rs.next()) {
            Integer id = rs.getInt("id");
            Integer idPas = rs.getInt("id_pasajero");
            String descripcion = rs.getString("descripcion");
            BigDecimal peso = rs.getBigDecimal("peso");
            Equipaje equipaje = new Equipaje(id, idPas, descripcion, peso);
            equipajes.add(equipaje);
        }
        rs.close();
        ps.close();
        conn.close();
        return equipajes;
    }

    public List<Reserva> buscarReservasPorPasajero(Integer idPasajero) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");
        String sql = "SELECT * FROM reservas WHERE id_pasajero = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setInt(1, idPasajero);

        ResultSet rs = ps.executeQuery();
        List<Reserva> reservas = new ArrayList<>();
        while (rs.next()) {
            Integer id = rs.getInt("id");
            Integer idPas = rs.getInt("id_pasajero");
            Integer idVuelo = rs.getInt("id_vuelo");
            Timestamp fechaReserva = rs.getTimestamp("fecha_reserva"); // Usar getTimestamp para datetime
            Reserva reserva = new Reserva(id, idPas, idVuelo, new Date(fechaReserva.getTime()));
            reservas.add(reserva);
        }
        rs.close();
        ps.close();
        conn.close();
        return reservas;
    }

    public List<Avion> buscarAvionesPorAerolinea(Integer idAerolinea) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");
        String sql = "SELECT * FROM aviones WHERE id_aerolinea = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setInt(1, idAerolinea);

        ResultSet rs = ps.executeQuery();
        List<Avion> aviones = new ArrayList<>();
        while (rs.next()) {
            Integer id = rs.getInt("id");
            String modelo = rs.getString("modelo");
            Integer capacidadAsientos = rs.getInt("capacidad_asientos");
            Integer idAero = rs.getInt("id_aerolinea");
            Integer idVuelo = rs.getInt("id_vuelo");
            Avion avion = new Avion(id, modelo, capacidadAsientos, idAero, idVuelo);
            aviones.add(avion);
        }
        rs.close();
        ps.close();
        conn.close();
        return aviones;
    }

    // MÉTODOS DE EDICIÓN

    public Aerolinea editarAerolinea(Integer id, String nombre, String paisOrigen) throws SQLException {
        // Verificar si ya existe otra aerolínea con ese nombre (excluyendo la actual)
        if (existeAerolineaParaEdicion(nombre, id)) {
            throw new SQLException("Ya existe otra aerolínea con el nombre: " + nombre);
        }
        
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "UPDATE aerolineas SET nombre = ?, pais_origen = ? WHERE id = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, nombre);
        ps.setString(2, paisOrigen);
        ps.setInt(3, id);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Actualización de aerolínea correcta.");
            ps.close();
            conn.close();
            return new Aerolinea(id, nombre, paisOrigen);
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido actualizar la aerolínea.");
        }
    }

    public Avion editarAvion(Integer id, String modelo, Integer capacidadAsientos, Integer idAerolinea, Integer idVuelo)
            throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "UPDATE aviones SET modelo = ?, capacidad_asientos = ?, id_aerolinea = ?, id_vuelo = ? WHERE id = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, modelo);
        ps.setInt(2, capacidadAsientos);
        ps.setInt(3, idAerolinea);
        ps.setInt(4, idVuelo);
        ps.setInt(5, id);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Actualización de avión correcta.");
            ps.close();
            conn.close();
            return new Avion(id, modelo, capacidadAsientos, idAerolinea, idVuelo);
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido actualizar el avión.");
        }
    }

    public Equipaje editarEquipaje(Integer id, Integer idPasajero, String descripcion, BigDecimal peso)
            throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "UPDATE equipajes SET id_pasajero = ?, descripcion = ?, peso = ? WHERE id = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setInt(1, idPasajero);
        ps.setString(2, descripcion);
        ps.setBigDecimal(3, peso);
        ps.setInt(4, id);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Actualización de equipaje correcta.");
            ps.close();
            conn.close();
            return new Equipaje(id, idPasajero, descripcion, peso);
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido actualizar el equipaje.");
        }
    }

    public Pasajero editarPasajero(Integer id, String nombre, String apellido, String dni, Date fechaNacimiento,
            String email) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "UPDATE pasajeros SET nombre = ?, apellido = ?, dni = ?, fecha_nacimiento = ?, email = ? WHERE id = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, nombre);
        ps.setString(2, apellido);
        ps.setString(3, dni);
        ps.setDate(4, fechaNacimiento);
        ps.setString(5, email);
        ps.setInt(6, id);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Actualización de pasajero correcta.");
            ps.close();
            conn.close();
            return new Pasajero(id, nombre, apellido, dni, fechaNacimiento, email);
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido actualizar el pasajero.");
        }
    }

    public Puerta editarPuerta(Integer id, String numeroPuerta, String terminal) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "UPDATE puertas SET numero_puerta = ?, terminal = ? WHERE id = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, numeroPuerta);
        ps.setString(2, terminal);
        ps.setInt(3, id);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Actualización de puerta correcta.");
            ps.close();
            conn.close();
            return new Puerta(id, numeroPuerta, terminal);
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido actualizar la puerta.");
        }
    }

    public Reserva editarReserva(Integer id, Integer idPasajero, Integer idVuelo, Date fechaReserva)
            throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "UPDATE reservas SET id_pasajero = ?, id_vuelo = ?, fecha_reserva = ? WHERE id = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setInt(1, idPasajero);
        ps.setInt(2, idVuelo);
        ps.setTimestamp(3, new Timestamp(fechaReserva.getTime())); // Usar Timestamp para datetime
        ps.setInt(4, id);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Actualización de reserva correcta.");
            ps.close();
            conn.close();
            return new Reserva(id, idPasajero, idVuelo, fechaReserva);
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido actualizar la reserva.");
        }
    }

    // CORRECCIÓN IMPORTANTE: Método editar vuelo con fechas datetime
    public Vuelo editarVuelo(Integer id, String numeroVuelo, String origen, String destino, Timestamp fechaSalida,
            Timestamp fechaLlegada) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "UPDATE vuelos SET numero_vuelo = ?, origen = ?, destino = ?, fecha_salida = ?, fecha_llegada = ? WHERE id = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, numeroVuelo);
        ps.setString(2, origen);
        ps.setString(3, destino);
        ps.setTimestamp(4, fechaSalida); // Usar Timestamp para datetime
        ps.setTimestamp(5, fechaLlegada); // Usar Timestamp para datetime
        ps.setInt(6, id);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Actualización de vuelo correcta.");
            ps.close();
            conn.close();
            
            // Convertir Timestamp a LocalDateTime para el objeto Vuelo
            LocalDateTime fechaSalidaLDT = fechaSalida.toLocalDateTime();
            LocalDateTime fechaLlegadaLDT = fechaLlegada.toLocalDateTime();
            
            return new Vuelo(id, numeroVuelo, origen, destino, fechaSalidaLDT, fechaLlegadaLDT);
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido actualizar el vuelo.");
        }
    }

    // MÉTODOS DE ELIMINACIÓN

    public String borrarAerolinea(Integer id) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "DELETE FROM aerolineas WHERE id = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setInt(1, id);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Eliminación de aerolínea correcta.");
            ps.close();
            conn.close();
            return "Aerolínea eliminada correctamente.";
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido eliminar la aerolínea.");
        }
    }

    public String borrarAvion(Integer id) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "DELETE FROM aviones WHERE id = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setInt(1, id);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Eliminación de avión correcta.");
            ps.close();
            conn.close();
            return "Avión eliminado correctamente.";
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido eliminar el avión.");
        }
    }

    public String borrarEquipaje(Integer id) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "DELETE FROM equipajes WHERE id = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setInt(1, id);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Eliminación de equipaje correcta.");
            ps.close();
            conn.close();
            return "Equipaje eliminado correctamente.";
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido eliminar el equipaje.");
        }
    }

    public String borrarPasajero(String dni) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "DELETE FROM pasajeros WHERE dni = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, dni);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Eliminación de pasajero correcta.");
            ps.close();
            conn.close();
            return "Pasajero eliminado correctamente.";
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido eliminar el pasajero.");
        }
    }

    public String borrarPuerta(Integer id) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "DELETE FROM puertas WHERE id = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setInt(1, id);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Eliminación de puerta correcta.");
            ps.close();
            conn.close();
            return "Puerta eliminada correctamente.";
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido eliminar la puerta.");
        }
    }

    public List<Puerta> buscarPuertas() throws SQLException {
        return buscarPuertasConFiltros("*", "*");
    }

    public List<Puerta> buscarPuertasConFiltros(String numeroPuertaBusqueda, String terminalBusqueda) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");
        
        StringBuilder sql = new StringBuilder("SELECT * FROM puertas WHERE 1=1");
        List<String> parametros = new ArrayList<>();
        
        if (numeroPuertaBusqueda != null && !numeroPuertaBusqueda.equals("*") && !numeroPuertaBusqueda.trim().isEmpty()) {
            sql.append(" AND numero_puerta LIKE ?");
            parametros.add("%" + numeroPuertaBusqueda + "%");
        }
        
        if (terminalBusqueda != null && !terminalBusqueda.equals("*") && !terminalBusqueda.trim().isEmpty()) {
            sql.append(" AND terminal LIKE ?");
            parametros.add("%" + terminalBusqueda + "%");
        }
        
        PreparedStatement ps = conn.prepareStatement(sql.toString());
        
        for (int i = 0; i < parametros.size(); i++) {
            ps.setString(i + 1, parametros.get(i));
        }
        
        ResultSet rs = ps.executeQuery();
        List<Puerta> puertas = new ArrayList<>();
        
        while (rs.next()) {
            Integer id = rs.getInt("id");
            String numeroPuerta = rs.getString("numero_puerta");
            String terminal = rs.getString("terminal");
            Puerta puerta = new Puerta(id, numeroPuerta, terminal);
            puertas.add(puerta);
        }
        
        rs.close();
        ps.close();
        conn.close();
        return puertas;
    }

    // Método para verificar si existe una puerta con el mismo número
    public boolean existePuerta(String numeroPuerta) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");
        
        String sql = "SELECT COUNT(*) FROM puertas WHERE numero_puerta = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, numeroPuerta);
        
        ResultSet rs = ps.executeQuery();
        boolean existe = false;
        if (rs.next()) {
            existe = rs.getInt(1) > 0;
        }
        
        rs.close();
        ps.close();
        conn.close();
        return existe;
    }

    // Método mejorado para buscar vuelos con parámetros opcionales
    public List<Vuelo> buscarVuelosConFiltros(String origen, String destino, String numeroVuelo) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");
        
        StringBuilder sql = new StringBuilder("SELECT * FROM vuelos WHERE 1=1");
        List<String> parametros = new ArrayList<>();
        
        if (origen != null && !origen.equals("*") && !origen.trim().isEmpty()) {
            sql.append(" AND origen LIKE ?");
            parametros.add("%" + origen + "%");
        }
        
        if (destino != null && !destino.equals("*") && !destino.trim().isEmpty()) {
            sql.append(" AND destino LIKE ?");
            parametros.add("%" + destino + "%");
        }
        
        if (numeroVuelo != null && !numeroVuelo.equals("*") && !numeroVuelo.trim().isEmpty()) {
            sql.append(" AND numero_vuelo LIKE ?");
            parametros.add("%" + numeroVuelo + "%");
        }
        
        PreparedStatement ps = conn.prepareStatement(sql.toString());
        
        for (int i = 0; i < parametros.size(); i++) {
            ps.setString(i + 1, parametros.get(i));
        }
        
        ResultSet rs = ps.executeQuery();
        List<Vuelo> vuelos = new ArrayList<>();
        
        while (rs.next()) {
            Integer id = rs.getInt("id");
            String numVuelo = rs.getString("numero_vuelo");
            String org = rs.getString("origen");
            String dest = rs.getString("destino");
            Date fechaSalida = rs.getDate("fecha_salida");
            Date fechaLlegada = rs.getDate("fecha_llegada");
            
            // Crear vuelo usando LocalDateTime si es necesario
            Vuelo vuelo = new Vuelo(id, numVuelo, org, dest, 
                                fechaSalida != null ? fechaSalida.toLocalDate().atStartOfDay() : null,
                                fechaLlegada != null ? fechaLlegada.toLocalDate().atStartOfDay() : null);
            vuelos.add(vuelo);
        }
        
        rs.close();
        ps.close();
        conn.close();
        return vuelos;
    }

    // Método para mantener compatibilidad con el método original
    public List<Vuelo> buscarVuelos(String origen, String destino) throws SQLException {
        return buscarVuelosConFiltros(origen, destino, "*");
    }

    // Método para verificar si existe un vuelo con el mismo número
    public boolean existeVuelo(String numeroVuelo) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");
        
        String sql = "SELECT COUNT(*) FROM vuelos WHERE numero_vuelo = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, numeroVuelo);
        
        ResultSet rs = ps.executeQuery();
        boolean existe = false;
        if (rs.next()) {
            existe = rs.getInt(1) > 0;
        }
        
        rs.close();
        ps.close();
        conn.close();
        return existe;
    }

    // Método para verificar vuelo en edición
    public boolean existeVueloParaEdicion(String numeroVuelo, Integer idVueloActual) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");
        
        String sql = "SELECT COUNT(*) FROM vuelos WHERE numero_vuelo = ? AND id != ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, numeroVuelo);
        ps.setInt(2, idVueloActual);
        
        ResultSet rs = ps.executeQuery();
        boolean existe = false;
        if (rs.next()) {
            existe = rs.getInt(1) > 0;
        }
        
        rs.close();
        ps.close();
        conn.close();
        return existe;
    }

    // ACTUALIZAR el método crearVuelo para incluir validación
    public Vuelo crearVuelo(String numeroVuelo, String origen, String destino, Date fechaSalida, Date fechaLlegada)
            throws SQLException {
        // Verificar si ya existe un vuelo con ese número
        if (existeVuelo(numeroVuelo)) {
            throw new SQLException("Ya existe un vuelo con el número: " + numeroVuelo);
        }
        
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "INSERT INTO vuelos (numero_vuelo, origen, destino, fecha_salida, fecha_llegada) VALUES(?,?,?,?,?)";
        PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
        ps.setString(1, numeroVuelo);
        ps.setString(2, origen);
        ps.setString(3, destino);
        ps.setDate(4, fechaSalida);
        ps.setDate(5, fechaLlegada);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Inserción de vuelo correcta.");
            ResultSet rs = ps.getGeneratedKeys();
            Integer generatedId = null;
            if (rs.next()) {
                generatedId = rs.getInt(1);
            }
            rs.close();
            ps.close();
            conn.close();
            
            return new Vuelo(generatedId, numeroVuelo, origen, destino, 
                            fechaSalida != null ? fechaSalida.toLocalDate().atStartOfDay() : null,
                            fechaLlegada != null ? fechaLlegada.toLocalDate().atStartOfDay() : null);
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido insertar el nuevo vuelo.");
        }
    }

    // ACTUALIZAR el método editarVuelo para incluir validación
    public Vuelo editarVuelo(Integer id, String numeroVuelo, String origen, String destino, Date fechaSalida,
            Date fechaLlegada) throws SQLException {
        // Verificar si ya existe otro vuelo con ese número (excluyendo el actual)
        if (existeVueloParaEdicion(numeroVuelo, id)) {
            throw new SQLException("Ya existe otro vuelo con el número: " + numeroVuelo);
        }
        
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");

        String sql = "UPDATE vuelos SET numero_vuelo = ?, origen = ?, destino = ?, fecha_salida = ?, fecha_llegada = ? WHERE id = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, numeroVuelo);
        ps.setString(2, origen);
        ps.setString(3, destino);
        ps.setDate(4, fechaSalida);
        ps.setDate(5, fechaLlegada);
        ps.setInt(6, id);

        int respuesta = ps.executeUpdate();
        if (respuesta == 1) {
            System.out.println("Actualización de vuelo correcta.");
            ps.close();
            conn.close();
            
            return new Vuelo(id, numeroVuelo, origen, destino,
                            fechaSalida != null ? fechaSalida.toLocalDate().atStartOfDay() : null,
                            fechaLlegada != null ? fechaLlegada.toLocalDate().atStartOfDay() : null);
        } else {
            ps.close();
            conn.close();
            throw new SQLException("No se ha podido actualizar el vuelo.");
        }
    }

    // Método para verificar si existe una puerta con el mismo número (excluyendo una puerta específica para edición)
    public boolean existePuertaParaEdicion(String numeroPuerta, Integer idPuertaActual) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");
        
        String sql = "SELECT COUNT(*) FROM puertas WHERE numero_puerta = ? AND id != ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, numeroPuerta);
        ps.setInt(2, idPuertaActual);
        
        ResultSet rs = ps.executeQuery();
        boolean existe = false;
        if (rs.next()) {
            existe = rs.getInt(1) > 0;
        }
        
        rs.close();
        ps.close();
        conn.close();
        return existe;
    }

    public boolean existeAerolinea(String nombre) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");
        
        String sql = "SELECT COUNT(*) FROM aerolineas WHERE nombre = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, nombre);
        
        ResultSet rs = ps.executeQuery();
        boolean existe = false;
        if (rs.next()) {
            existe = rs.getInt(1) > 0;
        }
        
        rs.close();
        ps.close();
        conn.close();
        return existe;
    }

    // Método para verificar aerolínea en edición
    public boolean existeAerolineaParaEdicion(String nombre, Integer idAerolineaActual) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/aeropuerto", "root", "");
        
        String sql = "SELECT COUNT(*) FROM aerolineas WHERE nombre = ? AND id != ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, nombre);
        ps.setInt(2, idAerolineaActual);
        
        ResultSet rs = ps.executeQuery();
        boolean existe = false;
        if (rs.next()) {
            existe = rs.getInt(1) > 0;
        }
        
        rs.close();
        ps.close();
        conn.close();
        return existe;
    }
}