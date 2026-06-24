package com.Programacion4.Prode.services.interfaces;

import com.Programacion4.Prode.dto.request.PronosticoRequestDto;
import com.Programacion4.Prode.dto.response.UpsertPronosticoResult;

public interface IPronosticoCreateAndUpdateService {
    UpsertPronosticoResult createAndUpdate(PronosticoRequestDto dto, String email);
}
