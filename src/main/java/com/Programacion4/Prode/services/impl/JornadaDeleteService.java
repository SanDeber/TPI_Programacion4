package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.Utils.JornadaEliminateUtils;
import com.Programacion4.Prode.models.EstadoJornada;
import com.Programacion4.Prode.models.Jornada;
import com.Programacion4.Prode.repository.IJornadaRepository;
import com.Programacion4.Prode.services.interfaces.IJornadaDeleteService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class JornadaDeleteService implements IJornadaDeleteService {

    private final IJornadaRepository jornadaRepository;
    private final JornadaEliminateUtils utilEliminate;

    @Override
    public void softDelete(Long jornadaId) {

        Jornada jornada = jornadaRepository.findByIdAndEliminadoFalse(jornadaId)
                .orElseThrow(()-> new RuntimeException("La jornada con ese id no existe o fue eliminada"));

        if(!utilEliminate.aptoParaEliminar(jornadaId)){
            System.out.print("Si tiene jornada");
            throw new RuntimeException("La jornada tiene un partido asignado");
        }

        if (jornada.getEstado() != EstadoJornada.PROGRAMADA){
            throw new RuntimeException("La jornada esta en juego o finalizo, no puede ser eliminada");
        }

        jornada.setEliminado(true);

        jornadaRepository.save(jornada);

    }
}
