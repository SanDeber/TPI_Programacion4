package com.Programacion4.Prode.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Programacion4.Prode.models.User;


public interface IUserRepository extends JpaRepository<User, Long> {

    Optional<User>findByEmail(String email);
    
}
