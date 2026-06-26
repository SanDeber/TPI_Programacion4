import React, { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, registerRequest } from "../api/authService";

// ============================================================
// AuthContext
// ============================================================
// Este contexto es la "memoria" de la sesión del usuario en el
// frontend. Guarda:
//   - token: el JWT que devuelve el backend (lo necesitamos para
//     mandarlo en el header "Authorization" de futuras requests).
//   - rol: "ROLE_ADMIN" o "ROLE_USER", útil para mostrar/ocultar
//     pantallas según el rol más adelante.
//
// Todo se persiste en localStorage para que, si el usuario
// recarga la página, no se "deslogue" solo.
// ============================================================

const AuthContext = createContext(null);

// Claves usadas en localStorage (centralizadas para no repetir strings)
const STORAGE_KEYS = {
  token: "predigol_token",
  rol: "predigol_rol",
};

export function AuthProvider({ children }) {
  // Al iniciar, intentamos recuperar la sesión guardada anteriormente
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.token));
  const [rol, setRol] = useState(() => localStorage.getItem(STORAGE_KEYS.rol));

  // Cada vez que cambia el token/rol, lo sincronizamos con localStorage.
  // Si el token se borra (logout), también limpiamos el storage.
  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.token, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.token);
    }
  }, [token]);

  useEffect(() => {
    if (rol) {
      localStorage.setItem(STORAGE_KEYS.rol, rol);
    } else {
      localStorage.removeItem(STORAGE_KEYS.rol);
    }
  }, [rol]);

  // Llama a POST /api/auth/login y, si sale bien, guarda el token y el rol.
  // Devuelve la respuesta para que la página de Login pueda redirigir.
  async function login(email, password) {
    const data = await loginRequest(email, password);
    // Escribimos localStorage ya mismo (no solo vía el useEffect de arriba):
    // apiClient lee el token directo de localStorage, y si solo dependiéramos
    // del useEffect, las primeras requests disparadas justo al navegar tras
    // el login podrían salir sin token (el efecto corre después del commit).
    localStorage.setItem(STORAGE_KEYS.token, data.token);
    localStorage.setItem(STORAGE_KEYS.rol, data.rol);
    setToken(data.token);
    setRol(data.rol);
    return data;
  }

  // Llama a POST /api/auth/register. El backend ya devuelve un token
  // junto con el usuario creado, así que registrarse deja al usuario
  // logueado automáticamente (no hace falta loguearse de nuevo).
  async function register(name, email, password) {
    const data = await registerRequest(name, email, password);
    localStorage.setItem(STORAGE_KEYS.token, data.token);
    localStorage.setItem(STORAGE_KEYS.rol, data.rol);
    setToken(data.token);
    setRol(data.rol);
    return data;
  }

  // Cierra sesión: borra el token y el rol guardados.
  function logout() {
    setToken(null);
    setRol(null);
  }

  const value = {
    token,
    rol,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook de conveniencia: en cualquier componente, usar
//   const { token, rol, login, logout } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}
