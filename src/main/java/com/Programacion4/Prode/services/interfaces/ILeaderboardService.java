package com.Programacion4.Prode.services.interfaces;

import com.Programacion4.Prode.dto.response.LeaderboardResponseDto;

import java.util.List;

public interface ILeaderboardService {
    List<LeaderboardResponseDto> obtenerLeaderboard();

    List<LeaderboardResponseDto> grupoLeaderboard(Long id, String email);
}
