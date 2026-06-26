package com.Programacion4.Prode.services.interfaces;

import com.Programacion4.Prode.dto.response.GrupoResponseDto;

import java.util.List;

public interface IGruposGetService {
    List<GrupoResponseDto> misGrupos(String email);
}
