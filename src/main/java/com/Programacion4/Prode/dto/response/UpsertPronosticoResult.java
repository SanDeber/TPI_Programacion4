package com.Programacion4.Prode.dto.response;

public record UpsertPronosticoResult(
        PronosticoResponseDto pronostico,
        boolean created
) {
}
