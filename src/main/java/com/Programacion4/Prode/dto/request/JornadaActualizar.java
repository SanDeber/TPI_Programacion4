package com.Programacion4.Prode.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record JornadaActualizar(

        @NotNull(message = "El id es obligatorio para poder actualizar.")
        @Positive(message = "El id debe ser un número mayor a 0")
        Long id,

        @NotBlank(message = "El nombre es obligatorio.")
        String name
) {
}
