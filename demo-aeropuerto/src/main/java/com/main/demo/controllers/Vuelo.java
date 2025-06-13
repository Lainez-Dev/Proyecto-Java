package com.main.demo.controllers;

import java.time.LocalDateTime;
import java.util.Date;

public class Vuelo {
    private Integer id;
    private String numeroVuelo;
    private String origen;
    private String destino;
    private LocalDateTime fechaSalida;
    private LocalDateTime fechaLlegada;
    
    // Constructor vacío
    public Vuelo() {}
    
    // Constructor completo
    public Vuelo(Integer id, String numeroVuelo, String origen, String destino, 
                 LocalDateTime fechaSalida, LocalDateTime fechaLlegada) {
        this.id = id;
        this.numeroVuelo = numeroVuelo;
        this.origen = origen;
        this.destino = destino;
        this.fechaSalida = fechaSalida;
        this.fechaLlegada = fechaLlegada;
    }
    
    // Constructor para creación (sin ID)
    public Vuelo(String numeroVuelo, String origen, String destino, 
                 LocalDateTime fechaSalida, LocalDateTime fechaLlegada) {
        this.numeroVuelo = numeroVuelo;
        this.origen = origen;
        this.destino = destino;
        this.fechaSalida = fechaSalida;
        this.fechaLlegada = fechaLlegada;
    }
    
    // Getters y Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getNumeroVuelo() {
        return numeroVuelo;
    }
    
    public void setNumeroVuelo(String numeroVuelo) {
        this.numeroVuelo = numeroVuelo;
    }
    
    public String getOrigen() {
        return origen;
    }
    
    public void setOrigen(String origen) {
        this.origen = origen;
    }
    
    public String getDestino() {
        return destino;
    }
    
    public void setDestino(String destino) {
        this.destino = destino;
    }
    
    public LocalDateTime getFechaSalida() {
        return fechaSalida;
    }
    
    public void setFechaSalida(LocalDateTime fechaSalida) {
        this.fechaSalida = fechaSalida;
    }
    
    public LocalDateTime getFechaLlegada() {
        return fechaLlegada;
    }
    
    public void setFechaLlegada(LocalDateTime fechaLlegada) {
        this.fechaLlegada = fechaLlegada;
    }
    
    @Override
    public String toString() {
        return "Vuelo{" +
                "id=" + id +
                ", numeroVuelo='" + numeroVuelo + '\'' +
                ", origen='" + origen + '\'' +
                ", destino='" + destino + '\'' +
                ", fechaSalida=" + fechaSalida +
                ", fechaLlegada=" + fechaLlegada +
                '}';
    }
}