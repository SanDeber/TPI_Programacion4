package com.Programacion4.Prode.services.impl;

import org.springframework.stereotype.Service;

import com.Programacion4.Prode.dto.request.EquipoCreateRequestDTO;
import com.Programacion4.Prode.dto.response.EquipoResponse;
import com.Programacion4.Prode.mappers.EquipoMapper;
import com.Programacion4.Prode.models.Equipo;
import com.Programacion4.Prode.repository.IEquipoRepository;
import com.Programacion4.Prode.services.interfaces.ITeamCreateService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamCreateService implements ITeamCreateService{

    private final IEquipoRepository teamRepository;


    @Override
    public EquipoResponse createTeam(EquipoCreateRequestDTO dto) {

        if(teamRepository.findByName(dto.name().toLowerCase()).isPresent()){
            throw new RuntimeException("Este equipo ya fue registrado.");
        }

        Equipo equipoEntity = EquipoMapper.toEntity(dto);

        teamRepository.save(equipoEntity);

        return EquipoMapper.toResponse(equipoEntity);
    }
    
}
