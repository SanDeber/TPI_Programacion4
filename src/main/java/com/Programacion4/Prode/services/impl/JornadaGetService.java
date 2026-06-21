package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.dto.response.JornadaResponseDto;
import com.Programacion4.Prode.mappers.JornadaMapper;
import com.Programacion4.Prode.models.EstadoJornada;
import com.Programacion4.Prode.models.Jornada;
import com.Programacion4.Prode.repository.IJornadaRepository;
import com.Programacion4.Prode.services.interfaces.IJornadaGetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JornadaGetService implements IJornadaGetService {

    private final IJornadaRepository jornadaRepository;


    @Override
    public List<JornadaResponseDto> getJornadas(EstadoJornada estado) {

        List<Jornada> jornadas;

        if (estado == null) {

             jornadas = jornadaRepository.findByEliminadoFalse();

        }else{

            jornadas = jornadaRepository.findByEliminadoFalseAndEstado(estado);

        }

        if(jornadas.isEmpty()){
            throw new RuntimeException("No se a encontrado jornada existente");
        }

        return jornadas.stream().map(JornadaMapper::toResponse).toList();
    }
}
