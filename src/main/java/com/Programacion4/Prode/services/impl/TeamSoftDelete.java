package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.Utils.EquipoInPartidoEliminadoUtil;
import com.Programacion4.Prode.repository.IPartidoRepository;
import org.springframework.stereotype.Service;

import com.Programacion4.Prode.models.Equipo;
import com.Programacion4.Prode.repository.IEquipoRepository;
import com.Programacion4.Prode.services.interfaces.ITeamSoftDelete;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamSoftDelete implements ITeamSoftDelete{
    
    private final IEquipoRepository teamRepository;
    private final IPartidoRepository partidoRepository;
    private final EquipoInPartidoEliminadoUtil partidoEliminadoUtil;

    @Override
    public void softDelete(Long id) {

        Equipo equipoEncontrado = teamRepository.findById(id).orElseThrow(()-> new RuntimeException("Equipo no encontrado."));

        if(!partidoEliminadoUtil.aptoParaEliminar(id)){
            throw new RuntimeException("El equipo tiene un partido asignado, no puede ser eliminado");
        }


        equipoEncontrado.setEliminado(true);

        teamRepository.save(equipoEncontrado);
    }

}
