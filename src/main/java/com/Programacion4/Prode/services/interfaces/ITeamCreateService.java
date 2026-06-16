package com.Programacion4.Prode.services.interfaces;

import com.Programacion4.Prode.dto.request.EquipoCreateRequestDTO;
import com.Programacion4.Prode.dto.response.EquipoResponse;

public interface ITeamCreateService {
    EquipoResponse createTeam(EquipoCreateRequestDTO dto);
}
