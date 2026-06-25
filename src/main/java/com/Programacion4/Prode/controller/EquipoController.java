package com.Programacion4.Prode.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.Programacion4.Prode.config.BaseResponse;
import com.Programacion4.Prode.dto.request.EquipoCreateRequestDTO;
import com.Programacion4.Prode.dto.response.EquipoResponse;
import com.Programacion4.Prode.services.interfaces.ITeamCreateService;
import com.Programacion4.Prode.services.interfaces.ITeamGetServices;
import com.Programacion4.Prode.services.interfaces.ITeamSoftDelete;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("api/equipos")
@RequiredArgsConstructor
public class EquipoController {

    private final ITeamCreateService teamCreateService;
    private final ITeamSoftDelete teamSoftDeleteService;
    private final ITeamGetServices teamGetService;

    @PostMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<EquipoResponse>> createEquipo(@RequestBody @Valid EquipoCreateRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            BaseResponse.ok(teamCreateService.createTeam(dto), "Equipo creado con Exito.")
        );
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<?>> softDelete(@PathVariable Long id){

        teamSoftDeleteService.softDelete(id);

        return ResponseEntity.ok().body(
            BaseResponse.noContent("El Equipo fue eliminado correctamente")
        );
    }

    @GetMapping()
    public ResponseEntity<BaseResponse<List<EquipoResponse>>> getEquipos(
            @RequestParam(required = false) String name
    ){
        return ResponseEntity.ok().body(
            BaseResponse.ok(teamGetService.getEquipos(name), "Equipos encontrados con exito.")
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<EquipoResponse>> getForId(@PathVariable Long id) {
        return ResponseEntity.ok().body(
         BaseResponse.ok(teamGetService.getForId(id), "Se encontro con exito.")   
        );
    }
}
