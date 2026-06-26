import { apiRequest } from "./apiClient";

// GET /api/equipos -> lista de equipos. Acepta filtro opcional por nombre.
export async function getEquipos(name) {
  const query = name ? `?name=${encodeURIComponent(name)}` : "";
  const response = await apiRequest(`/api/equipos${query}`, {
    method: "GET",
  });

  return response.data;
}

// POST /api/equipos -> crea un equipo nuevo (solo ADMIN).
// apiRequest ya agrega el header "Authorization: Bearer <token>"
// leyendo "predigol_token" de localStorage.
// El backend espera { name, escudo } (NO "nombre").
export async function createEquipo(name, escudo) {
  const response = await apiRequest("/api/equipos", {
    method: "POST",
    body: JSON.stringify({ name, escudo }),
  });

  return response.data;
}

// DELETE /api/equipos/{id} -> soft delete (solo ADMIN). El backend rechaza
// el borrado si el equipo tiene algún partido asociado (no eliminado).
export async function deleteEquipo(id) {
  const response = await apiRequest(`/api/equipos/${id}`, {
    method: "DELETE",
  });

  return response.data;
}
