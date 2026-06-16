package com.Programacion4.Prode.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EquipoCreateRequestDTO(

    @NotBlank(message="El nombre del equipo es obligatorio.")
    @Size(min=2, max=100, message="El tamaño del nombre es de 2 a 100 caracteres.")
    String name,
    
    @NotBlank(message = "El link del escudo no puede estar vacío")
    @Pattern(
        regexp = "^(https?:\\/\\/).+\\.(jpg|jpeg|png|gif|webp|svg)$",
        message = "Debe ingresar un link válido para el escudo"
    )
    String escudo

) {
    
}
