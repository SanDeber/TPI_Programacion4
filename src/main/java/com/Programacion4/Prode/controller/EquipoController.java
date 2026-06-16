package com.Programacion4.Prode.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Programacion4.Prode.config.BaseResponse;
import com.Programacion4.Prode.dto.request.EquipoCreateRequestDTO;
import com.Programacion4.Prode.dto.response.EquipoResponse;
import com.Programacion4.Prode.services.interfaces.ITeamCreateService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class EquipoController {

    private final ITeamCreateService teamCreateService;

    @PostMapping("/equipos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<EquipoResponse>> createEquipo(@RequestBody @Valid EquipoCreateRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            BaseResponse.ok(teamCreateService.createTeam(dto), "Equipo creado con Exito.")
        );
    }
    


}
