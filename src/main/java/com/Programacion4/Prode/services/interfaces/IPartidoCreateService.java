package com.Programacion4.Prode.services.interfaces;

import com.Programacion4.Prode.dto.request.PartidoRequestDto;
import com.Programacion4.Prode.dto.response.PartidoResponseDto;

public interface IPartidoCreateService {

    PartidoResponseDto createPartido(PartidoRequestDto dto);
}
