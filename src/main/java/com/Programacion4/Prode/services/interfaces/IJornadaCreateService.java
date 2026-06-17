package com.Programacion4.Prode.services.interfaces;

import com.Programacion4.Prode.dto.request.JornadaRequestDto;
import com.Programacion4.Prode.dto.response.JornadaResponseDto;

public interface IJornadaCreateService {
    JornadaResponseDto createJornada(JornadaRequestDto dto);
}
