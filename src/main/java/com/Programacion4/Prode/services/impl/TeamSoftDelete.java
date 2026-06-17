package com.Programacion4.Prode.services.impl;

import org.springframework.stereotype.Service;

import com.Programacion4.Prode.models.Equipo;
import com.Programacion4.Prode.repository.IEquipoRepository;
import com.Programacion4.Prode.services.interfaces.ITeamSoftDelete;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamSoftDelete implements ITeamSoftDelete{
    
    private final IEquipoRepository teamRepository;

    @Override
    public void softDelete(Long id) {

        Equipo equipoEncontrado = teamRepository.findById(id).orElseThrow(()-> new RuntimeException("Equipo no encontrado."));

        equipoEncontrado.setEliminado(true);

        teamRepository.save(equipoEncontrado);
    }

}
