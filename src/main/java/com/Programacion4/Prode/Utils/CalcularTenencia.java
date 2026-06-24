package com.Programacion4.Prode.Utils;

import com.Programacion4.Prode.models.Tendencia;
import org.springframework.stereotype.Component;

@Component
public class CalcularTenencia {
    public Tendencia calcular(Integer golesLocales, Integer golesVisitantes){
        if (golesLocales>golesVisitantes){
            return Tendencia.LOCAL;
        } else if (golesVisitantes>golesLocales) {
            return Tendencia.VISITANTE;
        }else {
            return Tendencia.EMPATE;
        }
    }
}
