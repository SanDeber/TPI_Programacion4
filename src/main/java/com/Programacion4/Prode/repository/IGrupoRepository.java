package com.Programacion4.Prode.repository;

import com.Programacion4.Prode.models.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IGrupoRepository extends JpaRepository<Grupo, Long> {

    boolean existsByCodigoIngreso(String codigo);

    Optional<Grupo> findByCodigoIngreso(String codigo);
}
