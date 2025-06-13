package com.main.demo.controllers;

public class Avion {
    private Integer id;
    private String modelo;
    private Integer capacidadAsientos;
    private Integer idAerolinea;
    private Integer idVuelo;
    
    // Constructor vacío
    public Avion() {}
    
    // Constructor completo
    public Avion(Integer id, String modelo, Integer capacidadAsientos, 
                 Integer idAerolinea, Integer idVuelo) {
        this.id = id;
        this.modelo = modelo;
        this.capacidadAsientos = capacidadAsientos;
        this.idAerolinea = idAerolinea;
        this.idVuelo = idVuelo;
    }
    
    // Constructor para creación (sin ID)
    public Avion(String modelo, Integer capacidadAsientos, 
                 Integer idAerolinea, Integer idVuelo) {
        this.modelo = modelo;
        this.capacidadAsientos = capacidadAsientos;
        this.idAerolinea = idAerolinea;
        this.idVuelo = idVuelo;
    }
    
    // Getters y Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getModelo() {
        return modelo;
    }
    
    public void setModelo(String modelo) {
        this.modelo = modelo;
    }
    
    public Integer getCapacidadAsientos() {
        return capacidadAsientos;
    }
    
    public void setCapacidadAsientos(Integer capacidadAsientos) {
        this.capacidadAsientos = capacidadAsientos;
    }
    
    public Integer getIdAerolinea() {
        return idAerolinea;
    }
    
    public void setIdAerolinea(Integer idAerolinea) {
        this.idAerolinea = idAerolinea;
    }
    
    public Integer getIdVuelo() {
        return idVuelo;
    }
    
    public void setIdVuelo(Integer idVuelo) {
        this.idVuelo = idVuelo;
    }
    
    @Override
    public String toString() {
        return "Avion{" +
                "id=" + id +
                ", modelo='" + modelo + '\'' +
                ", capacidadAsientos=" + capacidadAsientos +
                ", idAerolinea=" + idAerolinea +
                ", idVuelo=" + idVuelo +
                '}';
    }
}