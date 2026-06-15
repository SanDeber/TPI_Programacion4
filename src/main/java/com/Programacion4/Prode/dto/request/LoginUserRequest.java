package com.Programacion4.Prode.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LoginUserRequest(

    @Pattern(
        regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]+$",
        message = "Solo se permiten números y letras"
    )
    @NotBlank(message="El nombre no debe estar en blanco")
    String name,

    @Email(message="El email debe tener el formato *****@***")
    String email,

    @Size(
        min = 8,
        max = 50,
        message = "La contraseña debe tener entre 8 y 50 caracteres"
    )
    @NotBlank(message="Debes completar la contraseña")
    String password

) {}
