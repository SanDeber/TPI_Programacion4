package com.Programacion4.Prode.services.interfaces;

import com.Programacion4.Prode.dto.request.JornadaActualizar;
import com.Programacion4.Prode.dto.response.JornadaResponseDto;

public interface IJornadaActualizarService {
    JornadaResponseDto actualizar(JornadaActualizar dto);
}
