package com.Programacion4.Prode.controller;


import com.Programacion4.Prode.config.BaseResponse;
import com.Programacion4.Prode.dto.request.PartidoRequestDto;
import com.Programacion4.Prode.dto.response.PartidoResponseDto;
import com.Programacion4.Prode.services.interfaces.IPartidoCreateService;
import com.Programacion4.Prode.services.interfaces.IPartidoDeleteService;
import com.Programacion4.Prode.services.interfaces.IPartidoGetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/partidos")
@RequiredArgsConstructor
public class PartidoController {

    private final IPartidoCreateService createService;
    private final IPartidoGetService getService;
    private final IPartidoDeleteService softDeleteService;

    @PostMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<PartidoResponseDto>> createPartido(
            @RequestBody @Valid PartidoRequestDto dto
            ){
        return ResponseEntity.status(HttpStatus.CREATED).body(
                BaseResponse.ok(createService.createPartido(dto), "Creado con exito")
        );
    }

    @GetMapping()
    public ResponseEntity<BaseResponse<List<PartidoResponseDto>>> getAll(
            @RequestParam(required = false) Long fechaId
    ){
        return ResponseEntity.ok().body(
                BaseResponse.ok(
                        getService.getPartidos(fechaId),
                        "Partidos Encontrados con exito"
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<?>> softDelete(
            @PathVariable Long id
    ){

        softDeleteService.deletePartido(id);

        return ResponseEntity.ok().body(
          BaseResponse.noContent("El partido fue eliminado con exito")
        );
    }

}
