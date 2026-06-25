package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.dto.response.PartidoResponseDto;
import com.Programacion4.Prode.mappers.PartidoMapper;
import com.Programacion4.Prode.models.Partido;
import com.Programacion4.Prode.repository.IPartidoRepository;
import com.Programacion4.Prode.services.interfaces.IPartidoGetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PartidoGetService implements IPartidoGetService {

    private final IPartidoRepository repository;

    @Override
    public List<PartidoResponseDto> getPartidos(Long jornadaId) {

        List<Partido> partidos;

        if (jornadaId == null) {
            partidos = repository.findByEliminadoFalse();
        }else {
            partidos = repository.findByEliminadoFalseAndJornadaId(jornadaId);
        }
        if (partidos.isEmpty()){
            throw new RuntimeException("No se encontro ningun partido con ese id, la jornada puede estar eliminada");
        }


        return partidos.stream().map(PartidoMapper::toResponse).toList();
    }
}
