package com.Programacion4.Prode.dto.response;

public record EquipoResponse(
    Long id,
    String nombre,
    String escudo,
    boolean eliminado
) {
    
}
