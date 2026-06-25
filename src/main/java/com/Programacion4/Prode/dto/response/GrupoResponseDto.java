package com.Programacion4.Prode.dto.response;

import java.util.List;

public record GrupoResponseDto(
        Long id,
        String name,
        String codigoInvitacion,
        List<String> miembros
) {
}
