package com.Programacion4.Prode.repository;

import com.Programacion4.Prode.models.MiembrosGrupo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IGrupoMiembroRepository extends JpaRepository<MiembrosGrupo, Long> {
    List<MiembrosGrupo> findByGrupoId(Long id);
}
