package com.Programacion4.Prode.controller;

import com.Programacion4.Prode.config.BaseResponse;
import com.Programacion4.Prode.dto.request.GrupoCreateRequestDto;
import com.Programacion4.Prode.dto.request.UnirseRequestDto;
import com.Programacion4.Prode.dto.response.GrupoResponseDto;
import com.Programacion4.Prode.dto.response.LeaderboardResponseDto;
import com.Programacion4.Prode.services.interfaces.IGrupoCreateService;
import com.Programacion4.Prode.services.interfaces.IGruposGetService;
import com.Programacion4.Prode.services.interfaces.ILeaderboardService;
import com.Programacion4.Prode.services.interfaces.IUnirseAGrupoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grupos")
@RequiredArgsConstructor
public class GrupoController {

    private final IGrupoCreateService createService;
    private final IUnirseAGrupoService unirseAGrupoService;
    private final ILeaderboardService leaderboardService;
    private final IGruposGetService gruposGetService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BaseResponse<GrupoResponseDto>> createGrupo(
            @RequestBody @Valid GrupoCreateRequestDto dto, Authentication authentication
            ) {

        String email = authentication.getName();
        return ResponseEntity.ok().body(
                BaseResponse.ok(
                    createService.crearGrupo(dto, email),
                        "Grupo creado con exito"
                )
        );
    }

    @PostMapping("/unirse")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BaseResponse<GrupoResponseDto>> unirse(
            @RequestBody @Valid UnirseRequestDto dto, Authentication authentication
            ){

        String email = authentication.getName();

        return ResponseEntity.ok().body(
                BaseResponse.ok(
                    unirseAGrupoService.unirse(dto, email),
                        "Te uniste a un grupo con exito"
                )
        );
    }

    @GetMapping("/mis-grupos")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BaseResponse<List<GrupoResponseDto>>> getMisGrupos(
            Authentication authentication
    ){

        String email = authentication.getName();

        return ResponseEntity.ok().body(
                BaseResponse.ok(
                        gruposGetService.misGrupos(email),
                        "Tus grupos traidos con exito"
                )
        );
    }

    @GetMapping("/{id}/leaderboard")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BaseResponse<List<LeaderboardResponseDto>>> getLeaderBoardGrupo(
            @PathVariable Long id, Authentication authentication
    ){

        String email = authentication.getName();

        return ResponseEntity.ok().body(
                BaseResponse.ok(
                        leaderboardService.grupoLeaderboard(id, email),
                        "Ranking devuelto con exito"
                )
        );
    }
}
