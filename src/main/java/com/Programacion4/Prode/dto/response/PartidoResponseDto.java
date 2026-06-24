package com.Programacion4.Prode.dto.response;

import com.Programacion4.Prode.models.EstadoPartido;

import java.time.LocalDateTime;

public record PartidoResponseDto(

        Long id,
        JornadaResponseDto jornada,
        EquipoResponse equipoLocal,
        Integer golesLocal,
        EquipoResponse equipoVisitante,
        Integer golesVisitante,
        EstadoPartido estado,
        LocalDateTime fechaInicio


) {
}
