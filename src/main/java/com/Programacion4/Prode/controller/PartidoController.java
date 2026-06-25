package com.Programacion4.Prode.controller;


import com.Programacion4.Prode.config.BaseResponse;
import com.Programacion4.Prode.dto.request.PartidoActualizarDto;
import com.Programacion4.Prode.dto.request.PartidoEstadoRequestDto;
import com.Programacion4.Prode.dto.request.PartidoRequestDto;
import com.Programacion4.Prode.dto.request.ResultadoPartidoDto;
import com.Programacion4.Prode.dto.response.PartidoResponseDto;
import com.Programacion4.Prode.services.interfaces.*;
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
    private final IPartidoActualizarService actualizarService;
    private final IPartidoCambiarEstadoService cambiarEstadoService;
    private final IPartidoResultadoService resultadoService;

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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<?>> softDelete(
            @PathVariable Long id
    ){

        softDeleteService.deletePartido(id);

        return ResponseEntity.ok().body(
          BaseResponse.noContent("El partido fue eliminado con exito")
        );
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<PartidoResponseDto>> actualizarPartido(
            @RequestBody @Valid PartidoActualizarDto dto,
            @PathVariable Long id
            ){
        return ResponseEntity.ok(
                BaseResponse.ok(
                        actualizarService.actualizar(dto,id),
                        "El partido se actualizo con exito"
                )
        );
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<?>> cambiarEstado(
            @PathVariable Long id,
            @RequestBody PartidoEstadoRequestDto estado
            ){

        cambiarEstadoService.cambiarEstado(estado.estado(), id);

        return ResponseEntity.ok().body(
                BaseResponse.noContent("Se actualizo el estado con exito")
        );
    }

    @PatchMapping("/{id}/resultado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<PartidoResponseDto>> cargarResultado(
            @RequestBody ResultadoPartidoDto dto,
            @PathVariable Long id

    ){
        return ResponseEntity.ok().body(
                BaseResponse.ok(
                    resultadoService.resultado(id, dto.golesLocales(), dto.golesVisitantes()),
                        "Los resultados fueron subidos con exito"
                )
        );
    }
}
