package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.Utils.CalcularHoraLimiteDelPronostico;
import com.Programacion4.Prode.dto.request.PartidoRequestDto;
import com.Programacion4.Prode.dto.response.PartidoResponseDto;
import com.Programacion4.Prode.mappers.PartidoMapper;
import com.Programacion4.Prode.models.Equipo;
import com.Programacion4.Prode.models.Jornada;
import com.Programacion4.Prode.models.Partido;
import com.Programacion4.Prode.repository.IEquipoRepository;
import com.Programacion4.Prode.repository.IJornadaRepository;
import com.Programacion4.Prode.repository.IPartidoRepository;
import com.Programacion4.Prode.services.interfaces.IPartidoCreateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PartidoCreateService implements IPartidoCreateService {

    private final IPartidoRepository partidoRepository;
    private final IEquipoRepository equipoRepository;
    private final IJornadaRepository jornadaRepository;
    private final CalcularHoraLimiteDelPronostico calcularHoraLimiteDelPronostico;



    @Override
    public PartidoResponseDto createPartido(PartidoRequestDto dto) {

        if (dto.equipoLocalId().equals(dto.equipoVisitanteId())){
            throw new RuntimeException("El equipo local y visitante no pueden ser el mismo");
        }

        Jornada jornada = jornadaRepository.findById(dto.jornadaId())
                .orElseThrow(()->
                        new RuntimeException("La jornada no fue encontrada"));

        if (jornada.isEliminado()){
            throw new RuntimeException("La jornada esta eliminada");
        }

        Equipo equipoLocal = equipoRepository.findById(dto.equipoLocalId())
                .orElseThrow(()->
                        new RuntimeException("El equipo local no fue encontrado"));

        if(equipoLocal.isEliminado()){
            throw new RuntimeException("El equipo local esta eliminado");
        }

        Equipo equipoVisitante = equipoRepository.findById(dto.equipoVisitanteId())
                .orElseThrow(()->
                        new RuntimeException("El equipo visitante no fue encontrado"));

        if (equipoVisitante.isEliminado()){
            throw new RuntimeException("El equipo visitante esta eliminado");
        }

        if(partidoRepository.existsEquipoInJornada(jornada.getId(),equipoLocal.getId()) ||
                partidoRepository.existsEquipoInJornada(jornada.getId(), equipoVisitante.getId())){

            throw new RuntimeException("Uno de los equipos seleccionados ya juega un partido en esta jornada");
        }


        Partido partido = PartidoMapper.toEntity(dto, jornada, equipoLocal, equipoVisitante);

        partido.setHoraLimitePronostico(calcularHoraLimiteDelPronostico.calcular(partido.getFechaHoraInicio()));

        partidoRepository.save(partido);

        return PartidoMapper.toResponse(partido);
    }
}
