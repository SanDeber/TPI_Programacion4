package com.Programacion4.Prode.services.interfaces;

import com.Programacion4.Prode.dto.request.LoginUserRequest;
import com.Programacion4.Prode.dto.request.RegisterUserRequest;
import com.Programacion4.Prode.dto.response.LoginResponse;

public interface IAuthService {
    LoginResponse login(LoginUserRequest request);
    LoginResponse register(RegisterUserRequest request);
}
