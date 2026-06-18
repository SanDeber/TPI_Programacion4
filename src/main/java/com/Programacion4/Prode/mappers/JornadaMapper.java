package com.Programacion4.Prode.mappers;


import com.Programacion4.Prode.dto.request.JornadaRequestDto;
import com.Programacion4.Prode.dto.response.JornadaResponseDto;
import com.Programacion4.Prode.models.EstadoJornada;
import com.Programacion4.Prode.models.Jornada;

public class JornadaMapper {

    public static Jornada toEntity(JornadaRequestDto dto){
        return Jornada.builder()
                .name(dto.name())
                .eliminado(false)
                .estado(EstadoJornada.PROGRAMADA)
                .build();
    }

    public static JornadaResponseDto toResponse(Jornada jornada){
        return new JornadaResponseDto(jornada.getId(),
                jornada.getName(),
                jornada.getEstado().name());
    }
}
