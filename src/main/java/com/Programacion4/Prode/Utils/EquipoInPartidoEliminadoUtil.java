package com.Programacion4.Prode.Utils;

import com.Programacion4.Prode.models.Partido;
import com.Programacion4.Prode.repository.IPartidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class EquipoInPartidoEliminadoUtil {

    private final IPartidoRepository partidoRepository;

    public boolean aptoParaEliminar(Long equipoId){

        List<Partido> partidosDelEquipo = partidoRepository.findByEquipoId(equipoId)
                .stream()
                .filter(p -> !p.isEliminado())
                .toList();

        return partidosDelEquipo.isEmpty();
    }

}
