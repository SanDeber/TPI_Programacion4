# API Endpoints — Prode Backend (Spring Boot)

Generado a partir de una lectura completa de `src\main\java\com\Programacion4\Prode` (controller, dto/request, dto/response, security, filter, models). Solo lectura — no se modificó nada del backend.

## Convenciones generales

- Todas las respuestas vienen envueltas en `BaseResponse<T>`:
  ```json
  {
    "data": "<T o null>",
    "message": "string",
    "errors": null,
    "timestamp": "ISO 8601 UTC"
  }
  ```
  Es decir, el payload real está siempre en `response.data`, no en la raíz.
- Auth: header `Authorization: Bearer <token>`. El JWT tiene `sub` = email del usuario y claim custom `rol` (ej. `ROLE_ADMIN`, `ROLE_USER`). Las autoridades de Spring Security se construyen agregando el rol tal cual (ya viene con prefijo `ROLE_`).
- Fechas: `LocalDateTime` se serializa en ISO 8601 (`yyyy-MM-ddTHH:mm:ss`), sin epoch.
- Roles: PUBLIC (sin token), USER (`ROLE_USER` o `ROLE_ADMIN`), ADMIN (`ROLE_ADMIN` only).
- **CORRECCIÓN (verificado contra `SecurityConfig.java` + prueba manual)**: la única ruta realmente pública es `/api/auth/**`. Todos los GET y PATCH bajo `/api/**` requieren estar autenticado (USER o ADMIN) — confirmado con un `GET /api/partidos` sin token que devuelve `403`. Esto corrige lo que se había marcado más abajo como "PUBLIC" en `GET /api/equipos`, `GET /api/equipos/{id}`, `GET /api/jornadas` y `GET /api/partidos`: en realidad son USER (cualquier rol autenticado), no público.

---

## 1. Auth

### POST `/api/auth/login`
- Rol: PUBLIC
- Request (`LoginUserRequest`):
  ```json
  { "email": "string", "password": "string (8-50 chars)" }
  ```
- Response `data` (`LoginResponse`):
  ```json
  { "token": "string", "rol": "string" }
  ```
- Status: 200

### POST `/api/auth/register`
- Rol: PUBLIC
- Request (`RegisterUserRequest`):
  ```json
  { "name": "string (solo letras/acentos/ñ)", "email": "string", "password": "string (8-50 chars)" }
  ```
- Response `data` (`LoginResponse`):
  ```json
  { "token": "string", "rol": "string" }
  ```
- Status: 201
- Nota: usuario nuevo siempre queda con `ROLE_USER`.

---

## 2. Equipos

### POST `/api/equipos`
- Rol: ADMIN
- Request (`EquipoCreateRequestDTO`):
  ```json
  { "name": "string (2-100 chars)", "escudo": "string (URL http/https)" }
  ```
- Response `data` (`EquipoResponse`):
  ```json
  { "id": 0, "nombre": "string", "escudo": "string", "eliminado": false }
  ```
- Status: 201
- **OJO**: el request usa `name`, pero la response usa `nombre` (no son simétricos).

### DELETE `/api/equipos/{id}`
- Rol: ADMIN
- Path var: `id` (Long)
- Soft delete. `data` = null.
- Status: 200

### GET `/api/equipos`
- Rol: USER (requiere token; cualquier rol autenticado)
- Query param opcional: `name` (filtro)
- Response `data`: `EquipoResponse[]`
- Status: 200

### GET `/api/equipos/{id}`
- Rol: USER (requiere token; cualquier rol autenticado)
- Response `data`: `EquipoResponse`
- Status: 200

---

## 3. Jornadas (fechas)

### POST `/api/jornadas`
- Rol: ADMIN
- Request (`JornadaRequestDto`):
  ```json
  { "name": "string (3-150 chars)" }
  ```
- Response `data` (`JornadaResponseDto`):
  ```json
  { "id": 0, "name": "string", "estado": "PROGRAMADA | EN_JUEGO | FINALIZADA" }
  ```
- Status: 201

### GET `/api/jornadas`
- Rol: USER (requiere token; cualquier rol autenticado)
- Query param opcional: `estado` (enum `EstadoJornada`)
- Response `data`: `JornadaResponseDto[]`
- Status: 200

### PATCH `/api/jornadas`
- Rol: ADMIN
- Sin path variable — el id va en el body.
- Request (`JornadaActualizar`):
  ```json
  { "id": 0, "name": "string" }
  ```
- Response `data`: `JornadaResponseDto`
- Status: 200

### DELETE `/api/jornadas/{id}`
- Rol: ADMIN
- Soft delete. `data` = null.
- Status: 200

---

## 4. Partidos

### POST `/api/partidos`
- Rol: ADMIN
- Request (`PartidoRequestDto`):
  ```json
  {
    "jornadaId": 0,
    "equipoLocalId": 0,
    "equipoVisitanteId": 0,
    "dateTime": "2026-06-24T19:30:00"
  }
  ```
  (`dateTime` debe ser fecha futura)
- Response `data` (`PartidoResponseDto`):
  ```json
  {
    "id": 0,
    "jornada": { "id": 0, "name": "string", "estado": "string" },
    "equipoLocal": { "id": 0, "nombre": "string", "escudo": "string", "eliminado": false },
    "golesLocal": 0,
    "equipoVisitante": { "id": 0, "nombre": "string", "escudo": "string", "eliminado": false },
    "golesVisitante": 0,
    "estado": "POR_JUGARSE | EN_JUEGO | FINALIZADO",
    "fechaInicio": "2026-06-24T19:30:00"
  }
  ```
- Status: 201
- **OJO**: el request usa `dateTime`, pero la response devuelve la fecha como `fechaInicio`.

### GET `/api/partidos`
- Rol: USER (requiere token; cualquier rol autenticado)
- Query param opcional: `fechaId` (en realidad es el id de la Jornada)
- Response `data`: `PartidoResponseDto[]`
- Status: 200

### DELETE `/api/partidos/{id}`
- Rol: ADMIN
- Soft delete. `data` = null.
- Status: 200

### PATCH `/api/partidos/{id}`
- Rol: ADMIN
- Request (`PartidoActualizarDto`):
  ```json
  { "equipoLocalId": 0, "equipoVisitanteId": 0, "fechaInicio": "2026-06-24T19:30:00" }
  ```
  (`fechaInicio` debe ser futura)
- Response `data`: `PartidoResponseDto`
- Status: 200
- **OJO**: aquí el campo de fecha en el request se llama `fechaInicio` (distinto del create que usa `dateTime`).

### PATCH `/api/partidos/{id}/estado`
- Rol: ADMIN
- Request (`PartidoEstadoRequestDto`):
  ```json
  { "estado": "POR_JUGARSE | EN_JUEGO | FINALIZADO" }
  ```
- `data` = null.
- Status: 200

### PATCH `/api/partidos/{id}/resultado`
- Rol: ADMIN
- Request (`ResultadoPartidoDto`):
  ```json
  { "golesLocales": 0, "golesVisitantes": 0 }
  ```
- Response `data`: `PartidoResponseDto`
- Status: 200

---

## 5. Pronósticos

### POST `/api/pronosticos`
- Rol: USER (token requerido; usuario se identifica por el email del JWT, no se manda en el body)
- Request (`PronosticoRequestDto`):
  ```json
  { "partidoId": 0, "golesLocales": 0, "golesVisitantes": 0 }
  ```
- Response `data` (`UpsertPronosticoResult`):
  ```json
  {
    "pronostico": {
      "nameUser": "string",
      "partido": { /* PartidoResponseDto completo */ },
      "golesLocal": 0,
      "golesVisitante": 0,
      "puntosGanados": 0
    },
    "created": true
  }
  ```
- Status: 200
- Es upsert: si ya existe un pronóstico de ese user para ese partido, lo actualiza (`created: false`) en vez de crear uno nuevo.
- **OJO nombres**: request usa `golesLocales`/`golesVisitantes`, pero el pronóstico anidado en la response usa `golesLocal`/`golesVisitante` (singular/plural distinto entre request y response).

### GET `/api/pronosticos/mis-pronosticos`
- Rol: USER
- Query param opcional: `estado` (enum `EstadoPartido`)
- Response `data`: `PronosticoResponseDto[]` (mismo shape que el `pronostico` de arriba)
- Status: 200

### GET `/api/pronosticos/partido/{id}`
- Rol: USER
- Path var: `id` = id de Partido
- Response `data`: `PronosticoResponseDto[]` — pronósticos de TODOS los usuarios para ese partido
- Status: 200

---

## 6. Grupos

### POST `/api/grupos`
- Rol: USER
- Request (`GrupoCreateRequestDto`):
  ```json
  { "name": "string (max 100)" }
  ```
- Response `data` (`GrupoResponseDto`):
  ```json
  { "id": 0, "name": "string", "codigoInvitacion": "string (8 chars)", "miembros": ["string"] }
  ```
- Status: 200
- Nota: el creador queda agregado automáticamente como miembro (extraído del JWT).

### POST `/api/grupos/unirse`
- Rol: USER
- Request (`UnirseRequestDto`):
  ```json
  { "codigo": "string (max 8)" }
  ```
- Response `data`: `GrupoResponseDto`
- Status: 200

### GET `/api/grupos/{id}/leaderboard`
- Rol: USER
- Response `data`: `LeaderboardResponseDto[]`:
  ```json
  { "posicion": 0, "username": "string", "puntosTotales": 0, "cantidadExactos": 0 }
  ```
  Misma forma que el leaderboard global (`LeaderboardResponseDto`), pero acotado a los miembros de ese grupo.
- Status: 200

### ⚠️ No existe endpoint para "listar mis grupos"
Confirmado (auditoría completa de `controller/`, `services/`, repos de Grupo): `GrupoController` solo expone los 3 endpoints de arriba (crear, unirse, leaderboard por id). No hay `GET /api/grupos`, `GET /api/grupos/mis-grupos`, ni nada en `User`/`AuthController` que devuelva los grupos de un usuario. `IGrupoMiembroRepository` solo tiene `findByGrupoId`, no `findByUserId`. Mientras no se agregue ese endpoint en el backend, el frontend no puede mostrar un listado persistente de "mis grupos" — solo puede mostrar el grupo recién creado/unido (de la respuesta del propio POST) y consultar el ranking de un grupo si se conoce su `id`.

---

## 7. Leaderboard global

### GET `/api/leaderboard`
- Rol: USER
- Response `data`: `LeaderboardResponseDto[]` (mismo shape que arriba, global en vez de por grupo)
- Status: 200

---

## 8. Resumen de roles por path

| Método | Path | Rol |
|---|---|---|
| POST | /api/auth/login | PUBLIC |
| POST | /api/auth/register | PUBLIC |
| GET | /api/equipos, /api/equipos/{id} | USER (autenticado, cualquier rol) |
| GET | /api/jornadas | USER (autenticado, cualquier rol) |
| GET | /api/partidos | USER (autenticado, cualquier rol) |
| POST/DELETE | /api/equipos/** | ADMIN |
| POST/PATCH/DELETE | /api/jornadas/** | ADMIN |
| POST/PATCH/DELETE | /api/partidos/** | ADMIN |
| POST/GET | /api/pronosticos/** | USER |
| POST/GET | /api/grupos/** | USER |
| GET | /api/leaderboard | USER |

## 9. Notas de modelos (relaciones)

- `Usuario` (`name`, `email`, `password`, `puntos`, `cantidadExactos`, `rol`) → 1-N `Pronostico`, 1-N `MiembrosGrupo`.
- `Equipo` (`name`, `escudo`, `eliminado`) → 1-N `Partido` (como local o visitante).
- `Jornada` (`name`, `estado`, `eliminado`) → 1-N `Partido`.
- `Partido` (`jornada`, `equipoLocal`, `equipoVisitante`, `golLocal`, `golVisitante`, `estado`, `fechaHoraInicio`, `horaLimitePronostico`, `eliminado`) → 1-N `Pronostico`.
- `Pronostico` (`userId`, `partidoId`, `golesLocal`, `golesVisitantes`, `fechaDePronostico`, `puntos`, `tendencia`) — constraint único (user_id, partido_id).
- `Grupo` (`name`, `codigoIngreso`, `eliminado`, `miembros`) → 1-N `MiembrosGrupo`.
