package com.main.demo.controllers;

public class Aerolinea {
    private Integer id;
    private String nombre;
    private String paisOrigen;
    
    // Constructor vacío
    public Aerolinea() {}
    
    // Constructor completo
    public Aerolinea(Integer id, String nombre, String paisOrigen) {
        this.id = id;
        this.nombre = nombre;
        this.paisOrigen = paisOrigen;
    }
    
    // Constructor para creación (sin ID)
    public Aerolinea(String nombre, String paisOrigen) {
        this.nombre = nombre;
        this.paisOrigen = paisOrigen;
    }
    
    // Getters y Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getPaisOrigen() {
        return paisOrigen;
    }
    
    public void setPaisOrigen(String paisOrigen) {
        this.paisOrigen = paisOrigen;
    }
    
    @Override
    public String toString() {
        return "Aerolinea{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", paisOrigen='" + paisOrigen + '\'' +
                '}';
    }
}