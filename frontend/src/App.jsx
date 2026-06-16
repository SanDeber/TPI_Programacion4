import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";

// Hojas de estilo de cada sección. Se importan acá (una sola vez)
// para que estén disponibles en toda la app.
import "./styles/auth.css";
import "./styles/home.css";

// ============================================================
// App.jsx
// ============================================================
// Define las rutas (páginas) de la aplicación:
//
//   /login    -> LoginPage     (pública)
//   /registro -> RegisterPage  (pública)
//   /         -> HomePage      (protegida: requiere estar logueado)
//
// Cualquier otra ruta no definida redirige a "/".
//
// A medida que se agreguen más pantallas (equipos, fechas,
// pronósticos, ranking, etc.), simplemente se agregan más
// <Route> acá. Las que necesiten login van adentro del
// <Route element={<ProtectedRoute />}>.
// ============================================================
export default function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* Rutas protegidas (requieren JWT válido en el AuthContext) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* Cualquier ruta desconocida -> redirige a la home
          (que a su vez redirige a /login si no hay sesión) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
