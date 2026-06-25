# Predigol — Frontend (Login / Registro)

Frontend en **React + Vite** para las pantallas de **login** y
**registro** de Predigol, conectado al backend de Spring Boot
(`AuthController` -> `/api/auth/login` y `/api/auth/register`).

## Cómo correrlo

```bash
npm install
npm run dev
```

Esto levanta el frontend en `http://localhost:5173`.

> **Importante:** el backend (Spring Boot) tiene que estar corriendo
> en `http://localhost:8080`. Vite ya tiene configurado un *proxy*
> (`vite.config.js`) que redirige todo lo que empiece con `/api`
> hacia el backend, así que no van a tener problemas de CORS en
> desarrollo.

Si el backend corre en otra URL, copien `.env.example` a `.env` y
completen `VITE_API_URL`.

## Estructura del proyecto

```
src/
├── api/
│   ├── apiClient.js     -> wrapper de fetch + manejo de errores
│   └── authService.js   -> llamadas a /api/auth/login y /register
├── context/
│   └── AuthContext.jsx  -> guarda token + rol (localStorage)
├── components/
│   ├── AuthLayout.jsx   -> layout compartido (panel logo + form)
│   ├── PitchBackground.jsx -> dibujo SVG decorativo (cancha)
│   ├── FormField.jsx    -> input + label + error
│   ├── Button.jsx       -> botón con estado "cargando"
│   └── ProtectedRoute.jsx -> bloquea rutas si no hay sesión
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── HomePage.jsx     -> pantalla placeholder post-login
├── styles/
│   ├── auth.css         -> estilos de login/registro
│   └── home.css         -> estilos de la home placeholder
├── index.css            -> TOKENS de diseño (colores, fuentes, radios)
├── App.jsx               -> rutas de la app
└── main.jsx              -> punto de entrada
```

Cada archivo tiene comentarios explicando qué hace y por qué, para
que sea fácil encontrar qué tocar si quieren cambiar algo.

## Dónde cambiar cada cosa

- **Colores / paleta**: `src/index.css` (sección `:root`). Todo el
  resto del proyecto usa esas variables (`var(--color-cyan)`, etc.),
  así que cambiándolas ahí se actualiza toda la app.
- **Tipografía**: también en `src/index.css`, variables
  `--font-display` y `--font-body`. Por ahora son fuentes de sistema;
  cuando eligan la tipografía definitiva, solo hay que cambiar estas
  dos líneas (y, si es una fuente de Google Fonts, agregar el
  `<link>` correspondiente en `index.html`).
- **Logo / frase de marca**: `src/components/AuthLayout.jsx`. El
  logo está en `src/assets/logo.png`.
- **Textos de los formularios** (labels, placeholders, mensajes de
  error): directamente en `LoginPage.jsx` y `RegisterPage.jsx`.
- **Validaciones de los campos**: funciones `validate()` dentro de
  cada página. Están alineadas con las validaciones del backend
  (`RegisterUserRequest.java` / `LoginUserRequest.java`).
- **Layout / diseño visual** (tamaños, espaciados, el dibujo de
  cancha de fondo): `src/styles/auth.css` y
  `src/components/PitchBackground.jsx`.

## Flujo implementado

1. **Registro** (`/registro`): nombre + email + contraseña ->
   `POST /api/auth/register`. El backend devuelve un JWT, así que el
   usuario queda logueado automáticamente y se lo redirige a `/`.
2. **Login** (`/login`): email + contraseña -> `POST /api/auth/login`.
   Si está OK, guarda el token/rol y redirige a `/`.
3. **Home** (`/`, protegida): pantalla simple que confirma la sesión
   y muestra un botón de "Cerrar sesión". Es un placeholder para que,
   más adelante, se reemplace por el dashboard real (equipos, fechas,
   pronósticos, ranking, etc.) reusando el mismo `AuthContext`.

## Manejo de errores del backend

`apiClient.js` intenta extraer un mensaje legible sin importar el
formato exacto de la respuesta de error (`message`, `error`,
`errors` como objeto o como lista), así que va a funcionar tanto con
el manejo de errores actual del backend como con la versión
mejorada que mencionamos (con `@RestControllerAdvice` y excepciones
propias).
