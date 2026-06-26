package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.dto.response.GrupoResponseDto;
import com.Programacion4.Prode.models.Grupo;
import com.Programacion4.Prode.models.MiembrosGrupo;
import com.Programacion4.Prode.models.User;
import com.Programacion4.Prode.repository.IGrupoMiembroRepository;
import com.Programacion4.Prode.repository.IUserRepository;
import com.Programacion4.Prode.services.interfaces.IGruposGetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GruposGetService implements IGruposGetService {

    private final IUserRepository userRepository;
    private final IGrupoMiembroRepository miembroRepository;

    @Override
    public List<GrupoResponseDto> misGrupos(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("El usuario no fue encontrado"));

        List<MiembrosGrupo> membresias = miembroRepository.findByUserId(user.getId());

        return membresias.stream()
                .map(membresia -> {
                    Grupo grupo = membresia.getGrupo();
                    List<String> miembros = grupo.getMiembros().stream()
                            .map(m -> m.getUser().getName())
                            .toList();
                    return new GrupoResponseDto(
                            grupo.getId(),
                            grupo.getName(),
                            grupo.getCodigoIngreso(),
                            miembros
                    );
                })
                .toList();
    }
}
