package com.Programacion4.Prode.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record GrupoCreateRequestDto (
        @NotBlank(message = "Debe ingresar el nombre del grupo")
        @Size(max = 100, message = "El nombre del grupo no puede superar los 100 caracteres")
        String name
){
}
