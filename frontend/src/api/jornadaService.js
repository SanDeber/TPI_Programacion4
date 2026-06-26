import { apiRequest } from "./apiClient";

// GET /api/jornadas -> lista de jornadas. Acepta filtro opcional por estado
// (PROGRAMADA | EN_JUEGO | FINALIZADA).
export async function getJornadas(estado) {
  const query = estado ? `?estado=${estado}` : "";
  const response = await apiRequest(`/api/jornadas${query}`, {
    method: "GET",
  });

  return response.data;
}

// POST /api/jornadas -> crea una jornada nueva (solo ADMIN).
// El backend espera { name } (NO "nombre").
export async function createJornada(name) {
  const response = await apiRequest("/api/jornadas", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

  return response.data;
}

// DELETE /api/jornadas/{id} -> soft delete (solo ADMIN). El backend rechaza
// el borrado si la jornada tiene algún partido asociado, o si no está
// en estado PROGRAMADA.
export async function deleteJornada(id) {
  const response = await apiRequest(`/api/jornadas/${id}`, {
    method: "DELETE",
  });

  return response.data;
}
