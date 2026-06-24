package com.Programacion4.Prode.Utils;

import com.Programacion4.Prode.models.Partido;
import com.Programacion4.Prode.repository.IPartidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class JornadaEliminateUtils {

    private final IPartidoRepository repository;

    public boolean aptoParaEliminar(Long jornadaId){

        List<Partido> partidos = repository.findByJornadaId(jornadaId).stream()
                .filter(partido -> !partido.isEliminado())
                .toList();

        
        return partidos.isEmpty();

    }

}
