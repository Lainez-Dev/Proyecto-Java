package com.main.demo.controllers;

import java.math.BigDecimal;

public class Equipaje {
    private Integer id;
    private Integer idPasajero;
    private String descripcion;
    private BigDecimal peso;
    
    // Constructor vacío
    public Equipaje() {}
    
    // Constructor completo
    public Equipaje(Integer id, Integer idPasajero, String descripcion, BigDecimal peso) {
        this.id = id;
        this.idPasajero = idPasajero;
        this.descripcion = descripcion;
        this.peso = peso;
    }
    
    // Constructor para creación (sin ID)
    public Equipaje(Integer idPasajero, String descripcion, BigDecimal peso) {
        this.idPasajero = idPasajero;
        this.descripcion = descripcion;
        this.peso = peso;
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
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public BigDecimal getPeso() {
        return peso;
    }
    
    public void setPeso(BigDecimal peso) {
        this.peso = peso;
    }
    
    @Override
    public String toString() {
        return "Equipaje{" +
                "id=" + id +
                ", idPasajero=" + idPasajero +
                ", descripcion='" + descripcion + '\'' +
                ", peso=" + peso +
                '}';
    }
}