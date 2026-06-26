import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ============================================================
// Sidebar.jsx
// ============================================================
// Sidebar compartido por toda el área autenticada (Dashboard,
// Mis pronósticos, Grupos, Admin). Resalta la sección activa según
// la ruta (y el hash, para las sub-secciones de Admin). Los ítems
// de gestión (equipos/jornadas/partidos) solo se muestran si el
// usuario logueado tiene ROLE_ADMIN.
// ============================================================

const NAV_ITEMS = [
  { label: "Dashboard", path: "/", userOnly: false },
  { label: "Pronósticos", path: "/predicciones", userOnly: true },
  { label: "Grupos", path: "/grupos", userOnly: true },
];

const ADMIN_NAV_ITEMS = [
  { label: "Equipos", path: "/admin#equipos" },
  { label: "Jornadas", path: "/admin#jornadas" },
  { label: "Partidos", path: "/admin#partidos" },
];

function NavButton({ item, isActive, onNavigate }) {
  return (
    <button
      className={`dv-nav-link${isActive ? " dv-nav-link--active" : ""}`}
      onClick={() => onNavigate(item.path)}
    >
      {item.label}
    </button>
  );
}

export default function Sidebar({ displayName, initials, globalRank }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, rol } = useAuth();

  const currentPath = `${location.pathname}${location.hash}`;
  const isAdmin = rol === "ROLE_ADMIN";

  return (
    <aside className="dv-sidebar">
      <div className="dv-logo">PREDIGOL</div>

      <div className="dv-profile">
        <div className="dv-avatar">{initials}</div>
        <div className="dv-profile-name">{displayName}</div>
        {globalRank && <div className="dv-rank-pill">▲ Posición #{globalRank}</div>}
      </div>

      <nav className="dv-nav">
        {NAV_ITEMS.filter((item) => !isAdmin || !item.userOnly).map((item) => (
          <NavButton
            key={item.path}
            item={item}
            isActive={location.pathname === item.path}
            onNavigate={navigate}
          />
        ))}

        {isAdmin && (
          <>
            <p className="dv-nav-label">Administración</p>
            {ADMIN_NAV_ITEMS.map((item) => (
              <NavButton
                key={item.path}
                item={item}
                isActive={currentPath === item.path}
                onNavigate={navigate}
              />
            ))}
          </>
        )}
      </nav>

      <button
        className="dv-logout"
        onClick={() => {
          logout();
          navigate("/login", { replace: true });
        }}
      >
        Cerrar sesión
      </button>
    </aside>
  );
}
