import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ============================================================
// ProtectedRoute.jsx
// ============================================================
// Guardia de rutas con soporte para autenticación y rol.
//
// Uso básico (solo requiere estar logueado):
//   <Route element={<ProtectedRoute />}>
//     <Route path="/" element={<HomePage />} />
//   </Route>
//
// Uso con rol (solo ROLE_ADMIN puede entrar):
//   <Route element={<ProtectedRoute requiredRol="ROLE_ADMIN" />}>
//     <Route path="/admin" element={<AdminPage />} />
//   </Route>
//
// Flujo:
//   1. Sin token → redirige a /login (guarda la ruta original en state.from)
//   2. Con token pero rol incorrecto → redirige a /
//   3. Todo OK → renderiza la ruta hija (<Outlet />)
// ============================================================
export default function ProtectedRoute({ requiredRol, forbiddenRol } = {}) {
  const { isAuthenticated, rol } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRol && rol !== requiredRol) {
    return <Navigate to="/" replace />;
  }

  if (forbiddenRol && rol === forbiddenRol) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
