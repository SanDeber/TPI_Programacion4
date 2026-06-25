package com.Programacion4.Prode.services.impl;

import com.Programacion4.Prode.Utils.CalcularTenencia;
import com.Programacion4.Prode.dto.request.PronosticoRequestDto;
import com.Programacion4.Prode.dto.response.UpsertPronosticoResult;
import com.Programacion4.Prode.mappers.PronosticoMapper;
import com.Programacion4.Prode.models.EstadoPartido;
import com.Programacion4.Prode.models.Partido;
import com.Programacion4.Prode.models.Pronostico;
import com.Programacion4.Prode.models.User;
import com.Programacion4.Prode.repository.IPartidoRepository;
import com.Programacion4.Prode.repository.IPronosticoRepository;
import com.Programacion4.Prode.repository.IUserRepository;
import com.Programacion4.Prode.services.interfaces.IPronosticoCreateAndUpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PronosticoCreateAndUpdateService implements IPronosticoCreateAndUpdateService {

    private final IPronosticoRepository pronosticoRepository;
    private final IPartidoRepository partidoRepository;
    private final IUserRepository userRepository;
    private final CalcularTenencia calcularTenencia;

    @Override
    public UpsertPronosticoResult createAndUpdate(PronosticoRequestDto dto, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("El usuario no fue encontrado"));

        Partido partido = partidoRepository.findByIdAndEliminadoFalse(dto.partidoId())
                .orElseThrow(()-> new RuntimeException("El partido no existe o fue eliminado"));


        if (partido.getEstado() != EstadoPartido.POR_JUGARSE){
            throw new RuntimeException("El partido esta en juego o ya se jugo, no se pueden hacer pronosticos");
        }

        LocalDateTime actual = LocalDateTime.now();

        if (!actual.isBefore(partido.getHoraLimitePronostico())){
            throw new RuntimeException("El horario limite para hacer pronosticos ya paso");
        }


        Optional<Pronostico> pronosticoExistente =
                pronosticoRepository.findByUserId_IdAndPartidoId_Id(user.getId(), partido.getId());

        if (pronosticoExistente.isPresent()){
            Pronostico pronostico = pronosticoExistente.get();
            pronostico.setGolesLocal(dto.golesLocales());
            pronostico.setGolesVisitantes(dto.golesVisitantes());
            pronostico.setFechaDePronostico(LocalDateTime.now());

            pronostico.setTendencia(calcularTenencia.calcular(dto.golesLocales(), dto.golesVisitantes()));

            Pronostico guardado = pronosticoRepository.save(pronostico);

            return new UpsertPronosticoResult(PronosticoMapper.toResponse(guardado),false);
        }

        Pronostico pronostico = PronosticoMapper.toEntity(dto,partido,user);

        pronostico.setTendencia(calcularTenencia.calcular(dto.golesLocales(), dto.golesVisitantes()));

        Pronostico guardado = pronosticoRepository.save(pronostico);

        return new UpsertPronosticoResult(PronosticoMapper.toResponse(guardado), true);
    }
}
