package com.Programacion4.Prode.Utils;

import com.Programacion4.Prode.dto.request.LeaderboardItemDto;
import com.Programacion4.Prode.dto.response.LeaderboardResponseDto;
import com.Programacion4.Prode.models.Pronostico;
import com.Programacion4.Prode.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CreateLeaderBoard {

    public List<LeaderboardResponseDto> createBoard(
            List<User> users,
            Map<Long, List<Pronostico>> pronosticosPorUsuario) {

        List<LeaderboardItemDto> items = users.stream()
                .map(user -> {
                    List<Pronostico> pronosticosUsuario =
                            pronosticosPorUsuario.getOrDefault(user.getId(), List.of());

                    LocalDateTime fechaMasAntigua = pronosticosUsuario.stream()
                            .map(Pronostico::getFechaDePronostico)
                            .filter(java.util.Objects::nonNull)
                            .min(LocalDateTime::compareTo)
                            .orElse(LocalDateTime.MAX);

                    return new LeaderboardItemDto(
                            user.getId(),
                            user.getName(),
                            user.getPuntos() != null ? user.getPuntos() : 0,
                            user.getCantidadExactos() != null ? user.getCantidadExactos() : 0,
                            fechaMasAntigua
                    );
                })
                .sorted(
                        Comparator.comparingInt(LeaderboardItemDto::puntosTotales).reversed()
                                .thenComparing(Comparator.comparingInt(LeaderboardItemDto::cantidadExactos).reversed())
                                .thenComparing(LeaderboardItemDto::fechaPronosticoMasAntiguo)
                )
                .toList();

        List<LeaderboardResponseDto> responseDtos = new ArrayList<>();

        for (int i = 0; i < items.size(); i++) {
            LeaderboardItemDto item = items.get(i);

            responseDtos.add(new LeaderboardResponseDto(
                    i + 1,
                    item.username(),
                    item.puntosTotales(),
                    item.cantidadExactos()
            ));
        }

        return responseDtos;
    }
}
