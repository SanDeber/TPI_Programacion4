package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.dto.response.PronosticoResponseDto;
import com.Programacion4.Prode.mappers.PronosticoMapper;
import com.Programacion4.Prode.models.EstadoPartido;
import com.Programacion4.Prode.models.Pronostico;
import com.Programacion4.Prode.models.User;
import com.Programacion4.Prode.repository.IPronosticoRepository;
import com.Programacion4.Prode.repository.IUserRepository;
import com.Programacion4.Prode.services.interfaces.IPronosticosGetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PronosticosGetService implements IPronosticosGetService {

    private final IUserRepository userRepository;
    private final IPronosticoRepository pronosticoRepository;


    @Override
    public List<PronosticoResponseDto> misPronosticos(String email, EstadoPartido filtroEstado) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("El usuario no fue encontrado, problema con la autenticacion"));

        List<Pronostico> pronosticos;

        pronosticos = pronosticoRepository.findByUserId_Id(user.getId());

        if (pronosticos.isEmpty()){
            throw new RuntimeException("No tienes ningun pronostico");
        }

        if (filtroEstado == null){
            return pronosticos.stream().map(PronosticoMapper::toResponse).toList();
        }

        List<Pronostico> pronosticosFiltros = pronosticos.stream()
                .filter(p -> p.getPartidoId().getEstado() == filtroEstado)
                .toList();

        return pronosticosFiltros.stream().map(PronosticoMapper::toResponse).toList();
    }

    @Override
    public List<PronosticoResponseDto> getByPartido(Long partidoId) {

        List<Pronostico> allPronosticos = pronosticoRepository.findByPartidoId_Id(partidoId).stream()
                .filter(p -> EstadoPartido.EN_JUEGO == p.getPartidoId().getEstado()
                        || EstadoPartido.FINALIZADO == p.getPartidoId().getEstado()
                        ||LocalDateTime.now().isAfter(p.getPartidoId().getHoraLimitePronostico()))
                .toList();

        if (allPronosticos.isEmpty()){
            throw new RuntimeException("El partido no tiene ningun pronostico aun, o no a pasado la hora limite de pronostico");
        }
        return allPronosticos.stream().map(PronosticoMapper::toResponse).toList();
    }
}
