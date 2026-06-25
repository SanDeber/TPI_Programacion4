package com.Programacion4.Prode.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Entity
@Table(name = "partidos")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Partido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "jornada_id")
    private Jornada jornada;

    @ManyToOne
    @JoinColumn(name = "equipo_local_id")
    private Equipo equipoLocal;

    @ManyToOne
    @JoinColumn(name = "equipo_visitante_id")
    private Equipo equipoVisitante;

    private Integer golLocal = 0;

    private Integer golVisitante = 0;

    @Enumerated(EnumType.STRING)
    private EstadoPartido estado;

    private boolean eliminado;

    private LocalDateTime fechaHoraInicio;

    private LocalDateTime horaLimitePronostico;

}
