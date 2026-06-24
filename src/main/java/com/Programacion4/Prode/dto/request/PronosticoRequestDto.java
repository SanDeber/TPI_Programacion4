package com.Programacion4.Prode.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PronosticoRequestDto(
        @NotNull(message = "El id del partido es obligatorio")
        @Positive(message = "El id no puede ser un número menor a 0")
        Long partidoId,
        @NotNull(message = "los goles del local son obligatorios")
        @Min(value = 0,message = "los goles no pueden ser menores a 0")
        Integer golesLocales,
        @NotNull(message = "los goles del visitantes son obligatorios")
        @Min(value = 0,message = "los goles no pueden ser menores a 0")
        Integer golesVisitantes
) {
}
