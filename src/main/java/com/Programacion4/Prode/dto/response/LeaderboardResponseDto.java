package com.Programacion4.Prode.dto.response;

public record LeaderboardResponseDto(
        Integer posicion,
        String username,
        Integer puntosTotales,
        Integer cantidadExactos
) {
}
