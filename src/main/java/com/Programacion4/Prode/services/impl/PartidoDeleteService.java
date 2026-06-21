package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.models.EstadoPartido;
import com.Programacion4.Prode.models.Partido;
import com.Programacion4.Prode.repository.IPartidoRepository;
import com.Programacion4.Prode.services.interfaces.IPartidoDeleteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PartidoDeleteService implements IPartidoDeleteService {

    private final IPartidoRepository repository;

    @Override
    public void deletePartido(Long id) {
        Partido partidoEncontrado = repository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new RuntimeException("El Partido no fue encontrado"));

        if (partidoEncontrado.getEstado() != EstadoPartido.POR_JUGARSE){
            throw new RuntimeException("El partido no se puede eliminar porque esta en juego o ya finalizo");
        }

        partidoEncontrado.setEliminado(true);

        repository.save(partidoEncontrado);
    }
}
