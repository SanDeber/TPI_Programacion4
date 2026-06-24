package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.Utils.CalcularHoraLimiteDelPronostico;
import com.Programacion4.Prode.dto.request.PartidoActualizarDto;
import com.Programacion4.Prode.dto.response.PartidoResponseDto;
import com.Programacion4.Prode.mappers.PartidoMapper;
import com.Programacion4.Prode.models.Equipo;
import com.Programacion4.Prode.models.EstadoPartido;
import com.Programacion4.Prode.models.Partido;
import com.Programacion4.Prode.repository.IEquipoRepository;
import com.Programacion4.Prode.repository.IPartidoRepository;
import com.Programacion4.Prode.services.interfaces.IPartidoActualizarService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PartidoActualizarService implements IPartidoActualizarService {

    private final IPartidoRepository partidoRepository;
    private final IEquipoRepository teamRepository;
    private final CalcularHoraLimiteDelPronostico calcularHoraPronostico;

    @Override
    public PartidoResponseDto actualizar(PartidoActualizarDto dto, Long id) {

        if (Objects.equals(dto.equipoLocalId(),dto.equipoVisitanteId())){
            throw new RuntimeException("Los dos equipos son el mismo, porfavor cambie uno de los dos");
        }

        Partido partidoEncontrado = partidoRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(()-> new RuntimeException("El partido con ese id no fue encontrado o fue eliminado"));

        if(partidoEncontrado.getEstado() != EstadoPartido.POR_JUGARSE){
            throw new RuntimeException("El partido ya se jugo o esta en juego, no se puede actualizar");
        }

        if(partidoRepository.existsEquipoInJornadaExcluyendoPartido(partidoEncontrado.getJornada().getId(),partidoEncontrado.getId(), dto.equipoLocalId())
                || partidoRepository.existsEquipoInJornadaExcluyendoPartido(partidoEncontrado.getJornada().getId(),partidoEncontrado.getId() ,dto.equipoVisitanteId())){
            throw new RuntimeException("Un equipo ya juega un partido en la jornada del partido");
        }

        Equipo equipoLocal = teamRepository.findByIdAndEliminadoFalse(dto.equipoLocalId())
                .orElseThrow(()->new RuntimeException("El equipo local no fue encontrado o esta eliminado"));
        Equipo equipoVisitante = teamRepository.findByIdAndEliminadoFalse(dto.equipoVisitanteId())
                .orElseThrow(()->new RuntimeException("El equipo visitante no fue encontrado o esta eliminado"));


        partidoEncontrado.setFechaHoraInicio(dto.fechaInicio());
        partidoEncontrado.setEquipoLocal(equipoLocal);
        partidoEncontrado.setEquipoVisitante(equipoVisitante);
        partidoEncontrado.setHoraLimitePronostico(calcularHoraPronostico.calcular(dto.fechaInicio()));

        Partido guardado = partidoRepository.save(partidoEncontrado);
        return PartidoMapper.toResponse(guardado);
    }
}
