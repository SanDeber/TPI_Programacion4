package com.Programacion4.Prode.services.interfaces;

import com.Programacion4.Prode.dto.response.PartidoResponseDto;

import java.util.List;

public interface IPartidoGetService {
    List<PartidoResponseDto> getPartidos(Long jornadaId);
}
