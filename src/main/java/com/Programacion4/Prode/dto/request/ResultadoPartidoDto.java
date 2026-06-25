package com.Programacion4.Prode.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record ResultadoPartidoDto(
        @NotNull(message = "Los goles deben ser ingresados")
        @PositiveOrZero(message = "Los goles no pueden ser menor a 0")
        Integer golesLocales,
        @NotNull(message = "Los goles deben ser ingresados")
        @PositiveOrZero(message = "Los goles no pueden ser menor a 0")
        Integer golesVisitantes
) {
}
