package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.models.EstadoJornada;
import com.Programacion4.Prode.models.EstadoPartido;
import com.Programacion4.Prode.models.Jornada;
import com.Programacion4.Prode.models.Partido;
import com.Programacion4.Prode.repository.IJornadaRepository;
import com.Programacion4.Prode.repository.IPartidoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CalcularEstadoJornada {

    private final IJornadaRepository jornadaRepository;
    private final IPartidoRepository partidoRepository;

    @Transactional
    public void calcularEstado(Jornada jornada){

        List<Partido> partidos = partidoRepository.findByEliminadoFalseAndJornadaId(jornada.getId());

        EstadoJornada nuevoEstado;

        if (partidos.isEmpty()){
            nuevoEstado = EstadoJornada.PROGRAMADA;
        } else if (partidos.stream().allMatch(partido -> partido.getEstado() == EstadoPartido.FINALIZADO)) {
            nuevoEstado = EstadoJornada.FINALIZADA;
        } else if (partidos.stream()
                .anyMatch(partido -> partido.getEstado() == EstadoPartido.EN_JUEGO
                || partido.getEstado() == EstadoPartido.FINALIZADO)) {
            nuevoEstado = EstadoJornada.EN_JUEGO;
        }else {
            nuevoEstado = EstadoJornada.PROGRAMADA;
        }

        jornada.setEstado(nuevoEstado);
        jornadaRepository.save(jornada);
    }

}
