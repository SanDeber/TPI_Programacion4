package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.Utils.CalcularTenencia;
import com.Programacion4.Prode.models.Partido;
import com.Programacion4.Prode.models.Pronostico;
import com.Programacion4.Prode.models.Tendencia;
import com.Programacion4.Prode.models.User;
import com.Programacion4.Prode.repository.IPronosticoRepository;
import com.Programacion4.Prode.repository.IUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CalcularPuntosPartido {
    private final CalcularTenencia calcularTenencia;
    private final IPronosticoRepository pronosticoRepository;
    private final IUserRepository userRepository;

    @Transactional
    public void calcularPuntos(Partido partido){
        Tendencia tendencia = calcularTenencia.calcular(partido.getGolLocal(), partido.getGolVisitante());

        List<Pronostico> pronosticos = pronosticoRepository.findByPartidoId_Id(partido.getId());

        pronosticos
                .forEach(pronostico -> {
                    User user = pronostico.getUserId();
                    Integer puntos = user.getPuntos();
                    Integer exactos = user.getCantidadExactos();

                    if (Objects.equals(pronostico.getGolesLocal(),partido.getGolLocal()) &&
                        Objects.equals(pronostico.getGolesVisitantes(),partido.getGolVisitante())){

                        puntos += 3;
                        exactos += 1;

                        user.setPuntos(puntos);
                        user.setCantidadExactos(exactos);
                        userRepository.save(user);

                        pronostico.setPuntos(3);
                        pronosticoRepository.save(pronostico);

                    }else if(pronostico.getTendencia() == tendencia){

                        puntos += 1;

                        user.setPuntos(puntos);
                        userRepository.save(user);

                        pronostico.setPuntos(1);
                        pronosticoRepository.save(pronostico);
                    }
                });
    }
}
