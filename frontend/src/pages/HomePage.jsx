import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

// ============================================================
// HomePage.jsx
// ============================================================
// Pantalla mínima que se ve después de loguearse o registrarse.
// Por ahora solo confirma que la sesión funciona (muestra el rol
// guardado) y tiene un botón de "Cerrar sesión".
//
// Esta pantalla es un PLACEHOLDER: cuando empiecen las pantallas
// reales (equipos, fechas, pronósticos, ranking, etc.) lo lógico
// es reemplazar este componente por la navegación/dashboard
// definitivo, reusando el mismo AuthContext para saber quién es
// el usuario logueado y de qué rol.
// ============================================================
export default function HomePage() {
  const { rol, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="home-page">
      <div className="home-card">
        <img src={logo} alt="Predigol" className="home-card__logo" />
        <h1>¡Estás dentro!</h1>
        <p>
          Iniciaste sesión correctamente como{" "}
          <strong>{rol === "ROLE_ADMIN" ? "administrador" : "usuario"}</strong>.
        </p>
        <p className="home-card__hint">
          Acá va a ir el resto de la app (equipos, fechas, pronósticos, ranking...).
        </p>
        <Button variant="ghost" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
