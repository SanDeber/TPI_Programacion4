package com.Programacion4.Prode.mappers;

import com.Programacion4.Prode.dto.request.PronosticoRequestDto;
import com.Programacion4.Prode.dto.response.PronosticoResponseDto;
import com.Programacion4.Prode.models.Partido;
import com.Programacion4.Prode.models.Pronostico;
import com.Programacion4.Prode.models.User;

import java.time.LocalDateTime;

public class PronosticoMapper {

    public static Pronostico toEntity(PronosticoRequestDto dto, Partido partido, User user){
        return Pronostico.builder()
                .userId(user)
                .partidoId(partido)
                .golesLocal(dto.golesLocales())
                .golesVisitantes(dto.golesVisitantes())
                .fechaDePronostico(LocalDateTime.now())
                .build();
    }

    public static PronosticoResponseDto toResponse(Pronostico p){
        return new PronosticoResponseDto(
                p.getUserId().getName(),
                PartidoMapper.toResponse(p.getPartidoId()),
                p.getGolesLocal(),
                p.getGolesVisitantes(),
                p.getPuntos()
        );
    }


}
