package com.Programacion4.Prode.dto.response;

import com.Programacion4.Prode.models.EstadoJornada;

public record JornadaResponseDto(

        Long id,
        String name,
        String estado,
        boolean asignada

) {
}
