package com.main.demo.controllers;

import java.util.Date;

public class Reserva {
    private Integer id;
    private Integer idPasajero;
    private Integer idVuelo;
    private Date fechaReserva;
    
    // Constructor vacío
    public Reserva() {}
    
    // Constructor completo
    public Reserva(Integer id, Integer idPasajero, Integer idVuelo, Date fechaReserva) {
        this.id = id;
        this.idPasajero = idPasajero;
        this.idVuelo = idVuelo;
        this.fechaReserva = fechaReserva;
    }
    
    // Constructor para creación (sin ID)
    public Reserva(Integer idPasajero, Integer idVuelo, Date fechaReserva) {
        this.idPasajero = idPasajero;
        this.idVuelo = idVuelo;
        this.fechaReserva = fechaReserva;
    }
    
    // Getters y Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public Integer getIdPasajero() {
        return idPasajero;
    }
    
    public void setIdPasajero(Integer idPasajero) {
        this.idPasajero = idPasajero;
    }
    
    public Integer getIdVuelo() {
        return idVuelo;
    }
    
    public void setIdVuelo(Integer idVuelo) {
        this.idVuelo = idVuelo;
    }
    
    public Date getFechaReserva() {
        return fechaReserva;
    }
    
    public void setFechaReserva(Date fechaReserva) {
        this.fechaReserva = fechaReserva;
    }
    
    @Override
    public String toString() {
        return "Reserva{" +
                "id=" + id +
                ", idPasajero=" + idPasajero +
                ", idVuelo=" + idVuelo +
                ", fechaReserva=" + fechaReserva +
                '}';
    }
}