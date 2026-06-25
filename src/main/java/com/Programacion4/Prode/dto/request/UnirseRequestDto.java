package com.Programacion4.Prode.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UnirseRequestDto (

        @NotBlank(message = "Debes pasar el codigo de ingreso")
        @Size(max = 8, message = "El codigo no puede tener mas de 8 caracteres")
        String codigo
){
}
