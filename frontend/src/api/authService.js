// ============================================================
// authService.js
// ============================================================
// Funciones que hablan puntualmente con los endpoints de
// autenticación del backend (AuthController):
//   POST /api/auth/login    -> { email, password }
//   POST /api/auth/register -> { name, email, password }
//
// Ambos devuelven un BaseResponse cuyo "data" tiene la forma:
//   { token: "<jwt>", rol: "ROLE_USER" | "ROLE_ADMIN" }
// ============================================================

import { apiRequest } from "./apiClient";

/**
 * Inicia sesión con email + contraseña.
 * @returns {Promise<{token: string, rol: string}>}
 */
export async function loginRequest(email, password) {
  const response = await apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // response = { data: { token, rol }, message, errors, timestamp }
  return response.data;
}

/**
 * Registra un usuario nuevo (rol USER por defecto en el backend).
 * El backend devuelve token + rol, así que el registro deja al
 * usuario logueado de una.
 * @returns {Promise<{token: string, rol: string}>}
 */
export async function registerRequest(name, email, password) {
  const response = await apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  return response.data;
}
