package com.Programacion4.Prode.services.interfaces;

import com.Programacion4.Prode.dto.response.PronosticoResponseDto;
import com.Programacion4.Prode.models.EstadoPartido;

import java.util.List;

public interface IPronosticosGetService {
    List<PronosticoResponseDto> misPronosticos(String email, EstadoPartido estadoPartido);
    List<PronosticoResponseDto> getByPartido(Long partidoId);
}
