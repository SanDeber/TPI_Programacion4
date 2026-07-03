# Predigol

Aplicación web de pronósticos deportivos (prode) tipo peña de amigos: los usuarios predicen el resultado de partidos organizados en jornadas, suman puntos según el acierto y compiten en un ranking global y por grupos privados.

Proyecto académico grupal desarrollado para la cátedra de Programación IV (UTN FRVM), por un equipo de 8 integrantes.

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.3-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring%20Security-JWT-6DB33F?style=flat&logo=springsecurity&logoColor=white)](https://spring.io/projects/spring-security)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Maven](https://img.shields.io/badge/Maven-C71A36?style=flat&logo=apachemaven&logoColor=white)](https://maven.apache.org/)

## Tabla de contenidos

- [Funcionalidades principales](#funcionalidades-principales)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura y estructura del proyecto](#arquitectura-y-estructura-del-proyecto)
- [Instalación y configuración](#instalación-y-configuración)
- [Cómo correr el proyecto](#cómo-correr-el-proyecto)
- [Tests](#tests)
- [Capturas de pantalla](#capturas-de-pantalla)
- [Mi contribución](#mi-contribución)
- [Notas](#notas)

## Funcionalidades principales

**Usuarios**
- Registro y login con autenticación JWT (roles `ROLE_USER` / `ROLE_ADMIN`).
- Carga de pronósticos (goles local/visitante) por partido, con upsert (crear o corregir mientras el partido no arrancó).
- Cierre automático de pronósticos 30 minutos antes del inicio del partido (`horaLimitePronostico`).
- Cálculo automático de puntos al cargar el resultado de un partido: 3 puntos por resultado exacto, 1 punto por acertar la tendencia (local/visitante/empate).
- Dashboard con estadísticas propias (puntos totales, posición global, cantidad de exactos, % de aciertos), próximos partidos de la jornada activa y pronósticos recientes.
- Vista de "Mis pronósticos" agrupada por jornada.
- Ranking (leaderboard) global.
- Grupos privados ("peñas"): crear grupo, unirse por código de invitación de 8 caracteres, ver "mis grupos" y ranking acotado a los miembros del grupo.

**Administración (`ROLE_ADMIN`)**
- ABM de equipos (con escudo) y baja lógica (soft delete, bloqueada si el equipo tiene partidos asociados).
- ABM de jornadas (fechas) y baja lógica (bloqueada si tiene partidos asociados o no está en estado `PROGRAMADA`).
- ABM de partidos: asignación a jornada, equipos local/visitante y fecha/hora.
- Control de estado del partido (`POR_JUGARSE` → `EN_JUEGO`) y carga de resultado final, que dispara el cálculo de puntos y actualiza el estado de la jornada.

## Stack tecnológico

**Backend**
- Java 21 + Spring Boot 3.5.3
- Spring Web, Spring Data JPA, Spring Security (JWT vía `jjwt` 0.12.3)
- Bean Validation (`spring-boot-starter-validation`)
- Lombok
- PostgreSQL (Neon) en runtime, H2 disponible como dependencia
- `spring-dotenv` para cargar variables desde `.env`
- Maven

**Frontend**
- React 18 + React Router 6
- Vite 5 (con proxy de `/api` hacia el backend en desarrollo)
- CSS plano organizado por hoja de estilos (sin framework de UI)

**Base de datos**
- PostgreSQL gestionado en Neon
- Hibernate con `ddl-auto=update`

## Arquitectura y estructura del proyecto

Backend en capas (controller → service → repository) con DTOs de request/response separados de las entidades, y mappers dedicados para convertir entre ambos. El frontend consume el backend a través de una capa de servicios (`frontend/src/api/`) con un cliente HTTP centralizado.

```
TPI_Programacion4/
├── src/main/java/com/Programacion4/Prode/
│   ├── controller/       # REST controllers (Auth, Equipo, Jornada, Partido, Pronostico, Grupo, LeaderBoard)
│   ├── services/
│   │   ├── interfaces/   # Contratos de cada servicio
│   │   └── impl/         # Implementaciones (una clase por caso de uso)
│   ├── repository/       # Spring Data JPA repositories
│   ├── models/           # Entidades JPA (User, Equipo, Jornada, Partido, Pronostico, Grupo, MiembrosGrupo)
│   ├── dto/
│   │   ├── request/      # DTOs de entrada
│   │   └── response/     # DTOs de salida
│   ├── mappers/          # Entidad <-> DTO
│   ├── security/         # JwtTokenProvider
│   ├── filter/           # JwtAuthenticationFilter
│   ├── config/           # SecurityConfig, GlobalExceptionHandler, BaseResponse
│   └── Utils/            # Reglas de negocio puntuales (cálculo de tendencia, hora límite, código de invitación, etc.)
│
└── frontend/
    └── src/
        ├── api/          # Capa de servicios: un archivo por dominio (auth, equipo, jornada, partido, pronostico, grupo, dashboard)
        ├── pages/         # LoginPage, RegisterPage, DashboardPage, PrediccionesPage, GruposPage, AdminPage
        ├── components/    # Sidebar, PredictModal, LeaderboardItem, TeamBadge, ConfirmDialog, etc.
        ├── context/       # AuthContext (token + rol en localStorage)
        ├── utils/         # Formateo de fechas, helpers de perfil
        └── styles/        # CSS por sección
```

Todas las respuestas del backend se envuelven en un `BaseResponse<T>` (`{ data, message, errors, timestamp }`); el detalle completo de endpoints, roles y particularidades de cada uno está documentado en [`frontend/ENDPOINTS.md`](frontend/ENDPOINTS.md).

## Instalación y configuración

### Requisitos

- Java 21 (JDK)
- Node.js 18+ y npm
- Una base de datos PostgreSQL (el proyecto está pensado para [Neon](https://neon.tech/), pero cualquier instancia de Postgres sirve)

### Backend

1. Clonar el repositorio y ubicarse en la raíz del proyecto.
2. Copiar `.env.example` a `.env`:

   ```bash
   cp .env.example .env
   ```

3. Completar `.env` con los datos reales:

   ```bash
   DB_URL=jdbc:postgresql://<host>/<database>?sslmode=require
   DB_USERNAME=
   DB_PASSWORD=
   JWT_SECRET=
   JWT_EXPIRATION=86400000
   SERVER_PORT=8080
   ```

   `JWT_SECRET` es la clave usada para firmar los tokens (cualquier string suficientemente largo sirve en desarrollo). El esquema de la base se crea/actualiza solo vía Hibernate (`ddl-auto=update`), no hace falta correr migraciones a mano.

### Frontend

1. Ubicarse en `frontend/` e instalar dependencias:

   ```bash
   cd frontend
   npm install
   ```

2. (Opcional) Si el backend **no** corre en `http://localhost:8080`, copiar `frontend/.env.example` a `frontend/.env` y definir `VITE_API_URL`. En desarrollo local no hace falta: Vite ya proxea `/api` hacia `localhost:8080` (ver `vite.config.js`).

## Cómo correr el proyecto

**Backend** (desde la raíz del proyecto):

```bash
./mvnw spring-boot:run       # Unix/Mac
.\mvnw.cmd spring-boot:run   # Windows
```

Queda escuchando en `http://localhost:8080` (o el puerto definido en `SERVER_PORT`).

**Frontend** (desde `frontend/`):

```bash
npm run dev
```

Queda disponible en `http://localhost:5173`.

Con ambos corriendo, la app funciona end-to-end: registro/login, carga de datos por el admin (equipos, jornadas, partidos) y pronósticos por parte de los usuarios.

## Tests

El proyecto incluye el test de contexto por defecto de Spring Boot (`ProdeApplicationTests`, verifica que el `ApplicationContext` levante correctamente). Se corre con:

```bash
./mvnw test
```

No hay suite de tests en el frontend.

## Notas

Proyecto con fines académicos, sin licencia definida. Pensado para correr en local.
