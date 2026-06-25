import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";

import "./styles/auth.css";
import "./styles/home.css";
import "./styles/dashboard.css";

export default function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* Rutas protegidas: requieren JWT válido */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
      </Route>

      {/* Rutas solo para ADMIN: redirige a "/" si el rol no es ROLE_ADMIN */}
      <Route element={<ProtectedRoute requiredRol="ROLE_ADMIN" />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      {/* Ruta no definida → home (que redirige a /login si no hay sesión) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
