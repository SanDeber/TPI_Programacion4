package com.Programacion4.Prode.services.interfaces;

import com.Programacion4.Prode.models.EstadoPartido;

public interface IPartidoCambiarEstadoService {
    void cambiarEstado(EstadoPartido estado, Long id);
}
