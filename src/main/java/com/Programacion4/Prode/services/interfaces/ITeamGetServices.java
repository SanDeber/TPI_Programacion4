package com.Programacion4.Prode.services.interfaces;

import java.util.List;

import com.Programacion4.Prode.dto.response.EquipoResponse;

public interface ITeamGetServices {
    EquipoResponse getForId(Long id);
    List<EquipoResponse> getEquipos(String name);
}
