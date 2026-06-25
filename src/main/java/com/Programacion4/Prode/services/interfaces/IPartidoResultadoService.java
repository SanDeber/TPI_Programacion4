package com.Programacion4.Prode.services.interfaces;

import com.Programacion4.Prode.dto.response.PartidoResponseDto;

public interface IPartidoResultadoService {
    PartidoResponseDto resultado(Long id, Integer golesLocales, Integer golesVisitantes);
}
