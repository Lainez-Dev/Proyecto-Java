package com.main.demo.controllers;

public class Puerta {
    private Integer id;
    private String numeroPuerta;
    private String terminal;
    
    // Constructor vacío
    public Puerta() {}
    
    // Constructor completo
    public Puerta(Integer id, String numeroPuerta, String terminal) {
        this.id = id;
        this.numeroPuerta = numeroPuerta;
        this.terminal = terminal;
    }
    
    // Constructor para creación (sin ID)
    public Puerta(String numeroPuerta, String terminal) {
        this.numeroPuerta = numeroPuerta;
        this.terminal = terminal;
    }
    
    // Getters y Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getNumeroPuerta() {
        return numeroPuerta;
    }
    
    public void setNumeroPuerta(String numeroPuerta) {
        this.numeroPuerta = numeroPuerta;
    }
    
    public String getTerminal() {
        return terminal;
    }
    
    public void setTerminal(String terminal) {
        this.terminal = terminal;
    }
    
    @Override
    public String toString() {
        return "Puerta{" +
                "id=" + id +
                ", numeroPuerta='" + numeroPuerta + '\'' +
                ", terminal='" + terminal + '\'' +
                '}';
    }
}