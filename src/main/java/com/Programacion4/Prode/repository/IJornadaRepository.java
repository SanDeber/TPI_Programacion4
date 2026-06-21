package com.Programacion4.Prode.repository;

import com.Programacion4.Prode.models.EstadoJornada;
import com.Programacion4.Prode.models.Jornada;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IJornadaRepository extends JpaRepository<Jornada, Long> {

    List<Jornada> findByEliminadoFalse();

    List<Jornada> findByEliminadoFalseAndEstado(EstadoJornada estado);
}
