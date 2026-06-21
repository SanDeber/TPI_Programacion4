package com.Programacion4.Prode.services.interfaces;

import com.Programacion4.Prode.dto.response.JornadaResponseDto;
import com.Programacion4.Prode.models.EstadoJornada;


import java.util.List;

public interface IJornadaGetService {
    List<JornadaResponseDto> getJornadas(EstadoJornada estado);
}
