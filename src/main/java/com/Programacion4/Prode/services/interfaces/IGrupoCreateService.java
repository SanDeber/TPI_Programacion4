package com.Programacion4.Prode.services.interfaces;

import com.Programacion4.Prode.dto.request.GrupoCreateRequestDto;
import com.Programacion4.Prode.dto.response.GrupoResponseDto;

public interface IGrupoCreateService {
    GrupoResponseDto crearGrupo(GrupoCreateRequestDto dto, String email);
}
