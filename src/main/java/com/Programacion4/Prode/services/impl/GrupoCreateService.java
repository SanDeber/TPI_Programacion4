package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.Utils.GenerarCodigoInvitacion;
import com.Programacion4.Prode.dto.request.GrupoCreateRequestDto;
import com.Programacion4.Prode.dto.response.GrupoResponseDto;
import com.Programacion4.Prode.models.Grupo;
import com.Programacion4.Prode.models.MiembrosGrupo;
import com.Programacion4.Prode.models.User;
import com.Programacion4.Prode.repository.IGrupoMiembroRepository;
import com.Programacion4.Prode.repository.IGrupoRepository;
import com.Programacion4.Prode.repository.IUserRepository;
import com.Programacion4.Prode.services.interfaces.IGrupoCreateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class GrupoCreateService implements IGrupoCreateService {

    private final IUserRepository userRepository;
    private final GenerarCodigoInvitacion generarCodigoInvitacion;
    private final IGrupoRepository grupoRepository;
    private final IGrupoMiembroRepository miembroRepository;


    @Override
    public GrupoResponseDto crearGrupo(GrupoCreateRequestDto dto, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("El usuario no fue encontrado"));

        Grupo grupo = Grupo.builder()
                .name(dto.name())
                .codigoIngreso(generarCodigoInvitacion.generar())
                .build();

        Grupo grupoGuardado = grupoRepository.save(grupo);

        MiembrosGrupo miembroCreador = MiembrosGrupo.builder()
                .grupo(grupoGuardado)
                .user(user)
                .build();

        miembroRepository.save(miembroCreador);

        return new GrupoResponseDto(
                grupoGuardado.getId(),
                grupoGuardado.getName(),
                grupoGuardado.getCodigoIngreso(),
                List.of(user.getName())
        );
    }
}
