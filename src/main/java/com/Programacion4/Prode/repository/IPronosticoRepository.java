package com.Programacion4.Prode.repository;

import com.Programacion4.Prode.models.Pronostico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IPronosticoRepository extends JpaRepository<Pronostico,Long> {
    Optional<Pronostico> findByUserId_IdAndPartidoId_Id(Long userId, Long PartidoId);

    List<Pronostico> findByPartidoId_Id(Long id);

    List<Pronostico> findByUserId_Id(Long id);

    List<Pronostico> findByUserId_IdIn(List<Long> userIds);
    boolean existsByPartidoId_Id(Long partidoId);
}
