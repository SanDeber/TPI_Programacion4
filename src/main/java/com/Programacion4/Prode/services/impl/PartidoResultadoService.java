package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.dto.response.PartidoResponseDto;
import com.Programacion4.Prode.mappers.PartidoMapper;
import com.Programacion4.Prode.models.EstadoPartido;
import com.Programacion4.Prode.models.Partido;
import com.Programacion4.Prode.repository.IPartidoRepository;
import com.Programacion4.Prode.services.interfaces.IPartidoResultadoService;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PartidoResultadoService implements IPartidoResultadoService {

    private final IPartidoRepository partidoRepository;
    private final CalcularPuntosPartido puntosPartido;
    private final CalcularEstadoJornada estadoJornada;

    @Override
    public PartidoResponseDto resultado(Long id, Integer golesLocales, Integer golesVisitantes){

        if (golesLocales == null || golesVisitantes == null){
            throw new ValidationException("Los goles son campo obligatorio");
        }

        if(golesLocales < 0 || golesVisitantes < 0){
            throw new ValidationException("Los goles deben ser 0 o mayor");
        }


        Partido partido = partidoRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(()-> new RuntimeException("Partido no encontrado o eliminado"));

        if(partido.getEstado() != EstadoPartido.EN_JUEGO){
            throw new RuntimeException("El partido no se encuentra en juego.");
        }

        partido.setEstado(EstadoPartido.FINALIZADO);
        partido.setGolLocal(golesLocales);
        partido.setGolVisitante(golesVisitantes);

        Partido guardado = partidoRepository.save(partido);

        puntosPartido.calcularPuntos(guardado);
        estadoJornada.calcularEstado(guardado.getJornada());


        return PartidoMapper.toResponse(guardado);
    }
}
