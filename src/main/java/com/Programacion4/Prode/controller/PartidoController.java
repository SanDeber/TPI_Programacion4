package com.Programacion4.Prode.controller;


import com.Programacion4.Prode.config.BaseResponse;
import com.Programacion4.Prode.dto.request.PartidoRequestDto;
import com.Programacion4.Prode.dto.response.PartidoResponseDto;
import com.Programacion4.Prode.services.interfaces.IPartidoCreateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/partidos")
@RequiredArgsConstructor
public class PartidoController {

    private final IPartidoCreateService createService;

    @PostMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<PartidoResponseDto>> createPartido(
            @RequestBody @Valid PartidoRequestDto dto
            ){
        return ResponseEntity.status(HttpStatus.CREATED).body(
                BaseResponse.ok(createService.createPartido(dto), "Creado con exito")
        );
    }

}
