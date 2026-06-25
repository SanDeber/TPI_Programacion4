package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.dto.request.JornadaActualizar;
import com.Programacion4.Prode.dto.response.JornadaResponseDto;
import com.Programacion4.Prode.mappers.JornadaMapper;
import com.Programacion4.Prode.models.EstadoJornada;
import com.Programacion4.Prode.models.Jornada;
import com.Programacion4.Prode.repository.IJornadaRepository;
import com.Programacion4.Prode.services.interfaces.IJornadaActualizarService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JornadaActualizarService implements IJornadaActualizarService {

    private final IJornadaRepository jornadaRepository;


    @Override
    public JornadaResponseDto actualizar(JornadaActualizar dto) {

        Jornada jornada = jornadaRepository.findByIdAndEliminadoFalse(dto.id())
                .orElseThrow(()-> new RuntimeException("La jornada no existe o esta eliminada."));

        if(jornada.getEstado() != EstadoJornada.PROGRAMADA){
            throw new RuntimeException("La jornada esta en juego o ya fue finalizada, no se puede modificar");
        }

        jornada.setName(dto.name());

        jornadaRepository.save(jornada);

        return JornadaMapper.toResponse(jornada);
    }
}
