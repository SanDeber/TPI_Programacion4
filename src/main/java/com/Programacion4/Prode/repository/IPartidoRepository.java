package com.Programacion4.Prode.repository;


import com.Programacion4.Prode.models.Partido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface IPartidoRepository extends JpaRepository<Partido, Long> {
    boolean existsByEquipoLocalId(Long id);
    boolean existsByEquipoVisitanteId(Long id);

    @Query("""
        SELECT COUNT(p) > 0
        FROM Partido p
        WHERE p.jornada.id = :jornadaId
        AND (p.equipoLocal.id = :equipoId
             OR p.equipoVisitante.id = :equipoId)
    """)
    boolean existsEquipoInJornada(Long jornadaId, Long equipoId);
}
