package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.models.EstadoJornada;
import com.Programacion4.Prode.models.EstadoPartido;
import com.Programacion4.Prode.models.Jornada;
import com.Programacion4.Prode.models.Partido;
import com.Programacion4.Prode.repository.IJornadaRepository;
import com.Programacion4.Prode.repository.IPartidoRepository;
import com.Programacion4.Prode.services.interfaces.IPartidoCambiarEstadoService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class PartidoCambiarEstadoService implements IPartidoCambiarEstadoService {

    private final IPartidoRepository partidoRepository;
    private final IJornadaRepository jornadaRepository;
    private final CalcularEstadoJornada estadoJornada;

    @Override
    public void cambiarEstado(EstadoPartido estado, Long id) {

        Partido partido = partidoRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(()->new RuntimeException("El partido no fue encontrado o esta eliminado"));


        if(partido.getEstado() != EstadoPartido.POR_JUGARSE){
            throw new RuntimeException("El partido esta en juego o esta finalizado, no puedes hacer eso");
        }

        if (estado != EstadoPartido.EN_JUEGO){
            throw new RuntimeException("Unicamente puedes modificar el estado a 'EN_JUEGO'");
        }
        partido.setEstado(estado);

        Jornada jornada = partido.getJornada();

        partidoRepository.save(partido);

        estadoJornada.calcularEstado(jornada);

    }
}
