package com.Programacion4.Prode.services.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.Programacion4.Prode.dto.request.LoginUserRequest;
import com.Programacion4.Prode.dto.response.LoginResponse;
import com.Programacion4.Prode.security.JwtTokenProvider;
import com.Programacion4.Prode.services.interfaces.IAuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {
    
    private final AuthenticationManager authManager;
    private final UsuarioDetailsService userDetailsService;
    private final JwtTokenProvider tokenProvider;

    @Override
    public LoginResponse login(LoginUserRequest request){
        authManager.authenticate(new UsernamePasswordAuthenticationToken(
            request.email(), request.password()
        ));

        UserDetails user = userDetailsService.loadUserByUsername(request.email());
        String token = tokenProvider.generarToken(user);
        String rol =    user.getAuthorities().iterator().next().getAuthority();

        return new LoginResponse(token, rol);
    }
}
