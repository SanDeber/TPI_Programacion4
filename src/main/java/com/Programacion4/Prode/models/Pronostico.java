package com.Programacion4.Prode.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@Table(name = "pronosticos",
uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "partido_id"})
)
@NoArgsConstructor
@AllArgsConstructor
public class Pronostico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User userId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "partido_id")
    private Partido partidoId;

    private Integer golesLocal;

    private Integer golesVisitantes;

    private LocalDateTime fechaDePronostico;

    private Integer puntos = 0;

    @Enumerated(EnumType.STRING)
    private Tendencia tendencia;

}
