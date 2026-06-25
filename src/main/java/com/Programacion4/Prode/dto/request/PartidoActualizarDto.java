package com.Programacion4.Prode.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record PartidoActualizarDto(

        @NotNull(message = "El id del equipo local es obligatiro")
        @Positive(message = "El id debe ser positivo")
        Long equipoLocalId,
        @NotNull(message = "El id del equipo visitante es obligatorio")
        @Positive(message = "El id debe ser positivo")
        Long equipoVisitanteId,
        @NotNull(message = "La fecha debe ser obligatoria")
        @Future(message = "La fecha debe ser futura a la actual")
        LocalDateTime fechaInicio
) {
}
