package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.Utils.CreateLeaderBoard;
import com.Programacion4.Prode.dto.response.LeaderboardResponseDto;
import com.Programacion4.Prode.models.Grupo;
import com.Programacion4.Prode.models.MiembrosGrupo;
import com.Programacion4.Prode.models.Pronostico;
import com.Programacion4.Prode.models.Rol;
import com.Programacion4.Prode.models.User;
import com.Programacion4.Prode.repository.IGrupoMiembroRepository;
import com.Programacion4.Prode.repository.IGrupoRepository;
import com.Programacion4.Prode.repository.IPronosticoRepository;
import com.Programacion4.Prode.repository.IUserRepository;
import com.Programacion4.Prode.services.interfaces.ILeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService implements ILeaderboardService {

    private final IUserRepository userRepository;
    private final IPronosticoRepository pronosticoRepository;
    private final CreateLeaderBoard createLeaderBoard;
    private final IGrupoRepository grupoRepository;
    private final IGrupoMiembroRepository miembroRepository;

    @Override
    public List<LeaderboardResponseDto> obtenerLeaderboard() {
        List<User> users = userRepository.findByRolNot(Rol.ROLE_ADMIN);
        List<Pronostico> pronosticos = pronosticoRepository.findAll();

        Map<Long, List<Pronostico>> pronosticosPorUsuario = pronosticos.stream()
                .collect(Collectors.groupingBy(p -> p.getUserId().getId()));

        return createLeaderBoard.createBoard(users, pronosticosPorUsuario);
    }

    @Override
    public List<LeaderboardResponseDto> grupoLeaderboard(Long id, String email) {

        Grupo grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("El grupo no ha sido encontrado"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("El usuario no fue encontrado"));

        List<MiembrosGrupo> miembros = miembroRepository.findByGrupoId(id);

        boolean isMiembro = miembros.stream()
                .anyMatch(miembro -> miembro.getUser().getId().equals(user.getId()));

        if (!isMiembro) {
            throw new RuntimeException("Usted no es miembro del grupo.");
        }

        List<User> usuarios = miembros.stream()
                .map(MiembrosGrupo::getUser)
                .filter(u -> u.getRol() != Rol.ROLE_ADMIN)
                .toList();

        List<Long> usuariosId = usuarios.stream()
                .map(User::getId)
                .toList();

        List<Pronostico> pronosticos = pronosticoRepository.findByUserId_IdIn(usuariosId);

        Map<Long, List<Pronostico>> pronosticosPorUsuario = pronosticos.stream()
                .collect(Collectors.groupingBy(p -> p.getUserId().getId()));

        return createLeaderBoard.createBoard(usuarios, pronosticosPorUsuario);
    }
}
