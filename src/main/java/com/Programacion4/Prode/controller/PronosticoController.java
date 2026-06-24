package com.Programacion4.Prode.controller;


import com.Programacion4.Prode.config.BaseResponse;
import com.Programacion4.Prode.dto.request.PronosticoRequestDto;
import com.Programacion4.Prode.dto.response.PronosticoResponseDto;
import com.Programacion4.Prode.dto.response.UpsertPronosticoResult;
import com.Programacion4.Prode.models.EstadoPartido;
import com.Programacion4.Prode.services.interfaces.IPronosticoCreateAndUpdateService;
import com.Programacion4.Prode.services.interfaces.IPronosticosGetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/pronosticos")
@RequiredArgsConstructor
public class PronosticoController {
    private final IPronosticoCreateAndUpdateService createAndUpdateService;
    private final IPronosticosGetService getService;

    @PostMapping()
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BaseResponse<UpsertPronosticoResult>> createAndUpdate(
            @RequestBody @Valid PronosticoRequestDto dto, Authentication authentication
            ){
        String email = authentication.getName();

        UpsertPronosticoResult result = createAndUpdateService.createAndUpdate(dto,email);

        return ResponseEntity.ok().body(
          BaseResponse.ok(
                  result,"Exito, su pronostico ya fue enviado."
          )
        );
    }

    @GetMapping("/mis-pronosticos")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BaseResponse<List<PronosticoResponseDto>>> getMisPronosticos(
            Authentication authentication, @RequestParam(required = false)EstadoPartido estado
            ){
        String email = authentication.getName();

        return ResponseEntity.ok().body(
                BaseResponse.ok(
                    getService.misPronosticos(email,estado),
                        "Todos sus pronosticos traidos con exito"
                )
        );
    }

    @GetMapping("/partido/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BaseResponse<List<PronosticoResponseDto>>> getPronosticos(
            @PathVariable Long id
    ){
        return ResponseEntity.ok().body(
                BaseResponse.ok(
                        getService.getByPartido(id),
                        "Todos sus pronosticos traidos con exito"
                )
        );
    }
}
