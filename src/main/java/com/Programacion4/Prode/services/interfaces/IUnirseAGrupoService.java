package com.Programacion4.Prode.services.interfaces;

import com.Programacion4.Prode.dto.request.UnirseRequestDto;
import com.Programacion4.Prode.dto.response.GrupoResponseDto;

public interface IUnirseAGrupoService {
    GrupoResponseDto unirse(UnirseRequestDto dto, String email);
}
