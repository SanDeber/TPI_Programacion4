package com.Programacion4.Prode.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginUserRequest(

    @Email(message="El email debe tener el formato *****@***")
    @NotBlank(message = "el email es obligatorio")
    String email,

    @Size(
        min = 8,
        max = 50,
        message = "La contraseña debe tener entre 8 y 50 caracteres"
    )
    @NotBlank(message="Debes completar la contraseña")
    String password

) {}
