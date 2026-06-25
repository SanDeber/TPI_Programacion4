package com.Programacion4.Prode.dto.response;

public record PronosticoResponseDto(
        String nameUser,
        PartidoResponseDto partido,
        Integer golesLocal,
        Integer golesVisitante,
        Integer puntosGanados
) {
}
