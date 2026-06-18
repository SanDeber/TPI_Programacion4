package com.Programacion4.Prode.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record PartidoRequestDto(

        @NotNull(message = "La jornada es obligatoria porfavor ingrese el id")
        @Positive(message = "El id no puede ser menor a 1")
        Long jornadaId,

        @NotNull(message = "El equipo local es obligatoria porfavor ingrese el id")
        @Positive(message = "El id no puede ser menor a 1")
        Long equipoLocalId,
        @NotNull(message = "El equipo visitante es obligatoria porfavor ingrese el id")
        @Positive(message = "El id no puede ser menor a 1")
        Long equipoVisitanteId,

        @NotNull(message = "La fecha de inicio es obligatoria")
        @Future(message = "La fecha del partido no puede ser anterior a la fecha actual")
        LocalDateTime dateTime

) {
}
