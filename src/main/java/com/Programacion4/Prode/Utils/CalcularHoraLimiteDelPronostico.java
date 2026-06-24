package com.Programacion4.Prode.Utils;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class CalcularHoraLimiteDelPronostico {

    public LocalDateTime calcular(LocalDateTime time){

        if (time == null){
            throw new RuntimeException("La fecha de inicio esta vacia");
        }

        return time.minusMinutes(30);
    }
}
