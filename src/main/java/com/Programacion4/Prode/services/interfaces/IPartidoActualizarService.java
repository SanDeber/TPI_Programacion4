package com.Programacion4.Prode.services.interfaces;

import com.Programacion4.Prode.dto.request.PartidoActualizarDto;
import com.Programacion4.Prode.dto.response.PartidoResponseDto;

public interface IPartidoActualizarService {
    PartidoResponseDto actualizar(PartidoActualizarDto dto, Long id);
}
