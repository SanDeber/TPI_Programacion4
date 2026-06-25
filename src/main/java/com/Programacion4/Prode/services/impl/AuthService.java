package com.Programacion4.Prode.services.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Programacion4.Prode.dto.request.LoginUserRequest;
import com.Programacion4.Prode.dto.request.RegisterUserRequest;
import com.Programacion4.Prode.dto.response.LoginResponse;
import com.Programacion4.Prode.models.Rol;
import com.Programacion4.Prode.models.User;
import com.Programacion4.Prode.repository.IUserRepository;
import com.Programacion4.Prode.security.JwtTokenProvider;
import com.Programacion4.Prode.services.interfaces.IAuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {
    
    private final AuthenticationManager authManager;
    private final UsuarioDetailsService userDetailsService;
    private final JwtTokenProvider tokenProvider;
    private final IUserRepository userRepo;
    private final PasswordEncoder passworEncoder;

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

    @Override
    public LoginResponse register(RegisterUserRequest request) {
        
        if(userRepo.findByEmail(request.email()).isPresent()){
            throw new RuntimeException("El email ya existe");
        }

        User nuevoUsuario = User.builder()
        .name(request.name())
        .email(request.email())
        .password(passworEncoder.encode(request.password()))
        .rol(Rol.ROLE_USER)
        .build();

        userRepo.save(nuevoUsuario);

        String token = tokenProvider.generarToken(nuevoUsuario);

        return new LoginResponse(token, nuevoUsuario.getRol().name());
    }
}
