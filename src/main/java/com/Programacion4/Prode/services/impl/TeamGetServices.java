package com.Programacion4.Prode.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.Programacion4.Prode.dto.response.EquipoResponse;
import com.Programacion4.Prode.mappers.EquipoMapper;
import com.Programacion4.Prode.models.Equipo;
import com.Programacion4.Prode.repository.IEquipoRepository;
import com.Programacion4.Prode.services.interfaces.ITeamGetServices;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamGetServices implements ITeamGetServices{

    private final IEquipoRepository teamRepository;

    @Override
    public EquipoResponse getForId(Long id) {

        Equipo equipoEncontrado = teamRepository.findById(id).orElseThrow(()-> new RuntimeException("El equipo no fue encontrado."));

        if(equipoEncontrado.isEliminado()){
            throw new RuntimeException("Este id se encuentra eliminado.");
        }

        return EquipoMapper.toResponse(equipoEncontrado);
    }

    @Override
    public List<EquipoResponse> getEquipos(String name) {

        if (name == null || name.isEmpty()) {
            List<Equipo> equiposEncontrados = teamRepository.findAll()
                    .stream()
                    .filter(equipo -> !equipo.isEliminado())
                    .toList();

            if (equiposEncontrados.isEmpty()) {
                throw new RuntimeException("No se encontro ningun equipo o estan eliminado.");
            }

            return equiposEncontrados.stream().map(EquipoMapper::toResponse).toList();
        }

        List<Equipo> equiposPorNombre = teamRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .filter(equipo -> !equipo.isEliminado())
                .toList();

        if(equiposPorNombre.isEmpty()){
            throw new RuntimeException("No se encontro ningun equipo con este nombre.");
        }
    return equiposPorNombre.stream().map(EquipoMapper::toResponse).toList();
    }
    
}
