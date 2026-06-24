package com.Programacion4.Prode.controller;

import com.Programacion4.Prode.config.BaseResponse;
import com.Programacion4.Prode.dto.response.LeaderboardResponseDto;
import com.Programacion4.Prode.services.interfaces.ILeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/leaderboard")
@RequiredArgsConstructor
public class LeaderBoardController {

    private final ILeaderboardService leaderboardService;

    @GetMapping()
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BaseResponse<List<LeaderboardResponseDto>>> getLeaderBoard(){
        return ResponseEntity.ok().body(
                BaseResponse.ok(
                        leaderboardService.obtenerLeaderboard(),
                        "Ranking devuelto con exito"
                )
        );
    }

}
