package com.Programacion4.Prode.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Programacion4.Prode.models.Equipo;

public interface  IEquipoRepository  extends JpaRepository<Equipo, Long>{
    Optional<Equipo> findByName(String name);
}
