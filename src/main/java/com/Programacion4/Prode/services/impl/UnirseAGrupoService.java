package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.dto.request.UnirseRequestDto;
import com.Programacion4.Prode.dto.response.GrupoResponseDto;
import com.Programacion4.Prode.models.Grupo;
import com.Programacion4.Prode.models.MiembrosGrupo;
import com.Programacion4.Prode.models.User;
import com.Programacion4.Prode.repository.IGrupoMiembroRepository;
import com.Programacion4.Prode.repository.IGrupoRepository;
import com.Programacion4.Prode.repository.IUserRepository;
import com.Programacion4.Prode.services.interfaces.IUnirseAGrupoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UnirseAGrupoService implements IUnirseAGrupoService {

    private final IUserRepository userRepository;
    private final IGrupoRepository grupoRepository;
    private final IGrupoMiembroRepository miembroRepository;


    @Override
    public GrupoResponseDto unirse(UnirseRequestDto dto, String email) {

        Grupo grupoEncontrado = grupoRepository.findByCodigoIngreso(dto.codigo())
                .orElseThrow(()->new RuntimeException("El grupo con ese codigo no ha sido encontrado"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("Usuario no encontrado"));

        boolean yaEsMiembro = grupoEncontrado.getMiembros().stream()
                .anyMatch(miembro -> miembro.getUser().getId().equals(user.getId()));

        if (yaEsMiembro){
            throw new RuntimeException("El usuario ya es miembro de este grupo");
        }

        MiembrosGrupo nuevoMiembro = MiembrosGrupo.builder()
                .grupo(grupoEncontrado)
                .user(user)
                .build();

        miembroRepository.save(nuevoMiembro);
        grupoEncontrado.getMiembros().add(nuevoMiembro);

        List<String> miembros =  grupoEncontrado.getMiembros().stream()
                .map(miembrosGrupo -> miembrosGrupo.getUser().getName())
                .toList();

        return new GrupoResponseDto(
                grupoEncontrado.getId(),
                grupoEncontrado.getName(),
                grupoEncontrado.getCodigoIngreso(),
                miembros
        );
    }
}
