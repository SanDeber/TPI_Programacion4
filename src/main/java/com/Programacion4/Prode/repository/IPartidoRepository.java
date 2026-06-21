package com.Programacion4.Prode.repository;


import com.Programacion4.Prode.models.Partido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IPartidoRepository extends JpaRepository<Partido, Long> {

    Optional<Partido> findByIdAndEliminadoFalse(Long partidoId);

    List<Partido> findByEliminadoFalseAndJornadaId(Long jornadaId);

    List<Partido> findByEliminadoFalse();


    @Query("""
    SELECT p
    FROM Partido p
    WHERE p.equipoLocal.id = :equipoId
        OR p.equipoVisitante.id = :equipoId
""")
    List<Partido> findByEquipoId(Long equipoId);

    @Query("""
        SELECT COUNT(p) > 0
        FROM Partido p
        WHERE p.jornada.id = :jornadaId
        AND (p.equipoLocal.id = :equipoId
             OR p.equipoVisitante.id = :equipoId)
    """)
    boolean existsEquipoInJornada(Long jornadaId, Long equipoId);
}
