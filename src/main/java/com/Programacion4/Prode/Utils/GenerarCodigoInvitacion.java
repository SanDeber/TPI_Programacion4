package com.Programacion4.Prode.Utils;

import com.Programacion4.Prode.repository.IGrupoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.concurrent.ThreadLocalRandom;

@Component
@RequiredArgsConstructor
public class GenerarCodigoInvitacion {

    private static final String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final Integer leght = 8;

    private final IGrupoRepository grupoRepository;

    public String generar(){
        String codigo;

        do {
            codigo = randomCode();
        }while (grupoRepository.existsByCodigoIngreso(codigo));

        return codigo;
    }



    public String randomCode(){
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < leght; i++){
            int index = ThreadLocalRandom.current().nextInt(chars.length());
            sb.append(chars.charAt(index));
        }

        return sb.toString();
    }
}
