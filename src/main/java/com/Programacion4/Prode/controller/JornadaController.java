package com.Programacion4.Prode.controller;

import com.Programacion4.Prode.config.BaseResponse;
import com.Programacion4.Prode.dto.request.JornadaRequestDto;
import com.Programacion4.Prode.dto.response.JornadaResponseDto;
import com.Programacion4.Prode.services.interfaces.IJornadaCreateService;
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
@RequestMapping("api/jornadas")
@RequiredArgsConstructor
public class JornadaController {

    private final IJornadaCreateService createService;

    @PostMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<JornadaResponseDto>> create(@RequestBody @Valid JornadaRequestDto dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(
          BaseResponse.ok(createService.createJornada(dto), "Creado correctamente.")
        );
    }

    
}
