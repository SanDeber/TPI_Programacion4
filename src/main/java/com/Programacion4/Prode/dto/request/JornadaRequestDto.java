package com.Programacion4.Prode.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record JornadaRequestDto(

        @NotBlank(message = "El nombre de la jornada es obligatorio.")
        @Size(min = 3, max = 150, message = "El nombre debe tener entre 3 a 150 caracteres.")
        String name
) {
}
