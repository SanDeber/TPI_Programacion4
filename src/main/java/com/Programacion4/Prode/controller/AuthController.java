package com.Programacion4.Prode.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Programacion4.Prode.config.BaseResponse;
import com.Programacion4.Prode.dto.request.LoginUserRequest;
import com.Programacion4.Prode.dto.request.RegisterUserRequest;
import com.Programacion4.Prode.dto.response.LoginResponse;
import com.Programacion4.Prode.services.interfaces.IAuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final IAuthService authService;

    @PostMapping("/login")
    public ResponseEntity<BaseResponse<LoginResponse>> login(@RequestBody @Valid LoginUserRequest request){
        return ResponseEntity.ok().body(
            BaseResponse.ok(authService.login(request), "Haz igresado correctamente")
        );
    }

    @PostMapping("/register")
    public ResponseEntity<BaseResponse<LoginResponse>> register(@RequestBody @Valid RegisterUserRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(
            BaseResponse.ok(authService.register(request), "Usuario creado con exito")
        );
    }
}
