package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.dto.request.JornadaRequestDto;
import com.Programacion4.Prode.dto.response.JornadaResponseDto;
import com.Programacion4.Prode.mappers.JornadaMapper;
import com.Programacion4.Prode.models.Jornada;
import com.Programacion4.Prode.repository.IJornadaRepository;
import com.Programacion4.Prode.services.interfaces.IJornadaCreateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JornadaCreateService implements IJornadaCreateService {

    private final IJornadaRepository repository;

    @Override
    public JornadaResponseDto createJornada(JornadaRequestDto dto) {

        Jornada jornada = JornadaMapper.toEntity(dto);

        repository.save(jornada);

        return JornadaMapper.toResponse(jornada);
    }
}
