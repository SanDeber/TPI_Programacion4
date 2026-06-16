import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ============================================================
// ProtectedRoute.jsx
// ============================================================
// Componente "guardia" para rutas que requieren estar logueado.
// Se usa envolviendo rutas en App.jsx:
//
//   <Route element={<ProtectedRoute />}>
//     <Route path="/" element={<HomePage />} />
//   </Route>
//
// Si no hay token (isAuthenticated === false), redirige a
// "/login" y guarda en el state la ruta a la que el usuario
// quería entrar, para volver ahí después de loguearse
// (ver LoginPage.jsx, usa location.state.from).
//
// Si hay token, renderiza la ruta hija normalmente (<Outlet />).
// ============================================================
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
