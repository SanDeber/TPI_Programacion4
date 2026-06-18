import { apiRequest } from "./apiClient";

// POST /api/equipos -> crea un equipo nuevo (solo ADMIN).
// apiRequest ya agrega el header "Authorization: Bearer <token>"
// leyendo "predigol_token" de localStorage.
export async function createEquipo(nombre, escudo) {
  const response = await apiRequest("/api/equipos", {
    method: "POST",
    body: JSON.stringify({ nombre, escudo }),
  });

  return response.data;
}
