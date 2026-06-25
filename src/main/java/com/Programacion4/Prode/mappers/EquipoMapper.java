package com.Programacion4.Prode.mappers;

import com.Programacion4.Prode.dto.request.EquipoCreateRequestDTO;
import com.Programacion4.Prode.dto.response.EquipoResponse;
import com.Programacion4.Prode.models.Equipo;

public class EquipoMapper {
    public static Equipo toEntity(EquipoCreateRequestDTO dto){
        return Equipo.builder()
                        .name(dto.name().toLowerCase())
                        .escudo(dto.escudo())
                        .eliminado(false)
                        .build();
    }

    public static EquipoResponse toResponse(Equipo e){
        return new EquipoResponse(e.getId(),e.getName(), e.getEscudo(), e.isEliminado());
    }
}
