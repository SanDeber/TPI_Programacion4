package com.Programacion4.Prode.mappers;

import com.Programacion4.Prode.dto.request.PartidoRequestDto;
import com.Programacion4.Prode.dto.response.PartidoResponseDto;
import com.Programacion4.Prode.models.Equipo;
import com.Programacion4.Prode.models.EstadoPartido;
import com.Programacion4.Prode.models.Jornada;
import com.Programacion4.Prode.models.Partido;

public class PartidoMapper {

    public static Partido toEntity(PartidoRequestDto dto, Jornada jornada, Equipo local, Equipo visitante){
        return Partido.builder()
                .jornada(jornada)
                .equipoLocal(local)
                .equipoVisitante(visitante)
                .estado(EstadoPartido.POR_JUGARSE)
                .eliminado(false)
                .fechaHoraInicio(dto.dateTime())
                .build();
    }

    public static PartidoResponseDto toResponse(Partido p){
        return new PartidoResponseDto(
                p.getId(),
                JornadaMapper.toResponse(p.getJornada()),
                EquipoMapper.toResponse(p.getEquipoLocal()),
                p.getGolLocal(),
                EquipoMapper.toResponse(p.getEquipoVisitante()),
                p.getGolVisitante(),
                p.getEstado(),
                p.getFechaHoraInicio()
        );
    }
}
