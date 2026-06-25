package com.Programacion4.Prode.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterUserRequest(

    @NotBlank(message="el nombre es obligatorio")
    @Pattern(
        regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$",
        message = "El nombre solo puede contener letras"
    )
    String name,

    @Email(message = "El email debe tener el formato *****@***")
    @NotBlank(message = "El email no puede estar vacío")
    String email,
    
    @Size(min = 8, max = 50, message = "La contraseña debe tener entre 8 y 50 caracteres")
    @NotBlank(message = "Debes completar la contraseña")
    String password

) {
    
}
