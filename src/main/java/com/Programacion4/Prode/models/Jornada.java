package com.Programacion4.Prode.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "jornadas")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Jornada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private boolean eliminado;

    private boolean isAsignada;

    @Enumerated(EnumType.STRING)
    private EstadoJornada estado;
}
