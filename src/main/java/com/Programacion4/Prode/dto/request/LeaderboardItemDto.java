package com.Programacion4.Prode.dto.request;

import java.time.LocalDateTime;

public record LeaderboardItemDto(
        Long userId,
        String username,
        Integer puntosTotales,
        Integer cantidadExactos,
        LocalDateTime fechaPronosticoMasAntiguo
) {
}
