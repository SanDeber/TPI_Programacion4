import { apiRequest } from "./apiClient";

// ============================================================
// grupoService.js
// ============================================================
// Grupos/Peñas (RF8).
// ============================================================

// GET /api/grupos/mis-grupos -> grupos a los que pertenece el usuario autenticado.
export async function getMisGrupos() {
  const response = await apiRequest("/api/grupos/mis-grupos", { method: "GET" });
  return response.data;
}

// POST /api/grupos -> crea un grupo nuevo (cualquier USER autenticado).
// El creador queda agregado como miembro automáticamente (vía JWT).
export async function createGrupo(name) {
  const response = await apiRequest("/api/grupos", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

  return response.data;
}

// POST /api/grupos/unirse -> une al usuario actual a un grupo existente
// usando el código de invitación (máx 8 caracteres).
export async function joinGrupo(codigo) {
  const response = await apiRequest("/api/grupos/unirse", {
    method: "POST",
    body: JSON.stringify({ codigo }),
  });

  return response.data;
}

// GET /api/grupos/{id}/leaderboard -> ranking de un grupo puntual.
// Misma forma que el leaderboard global (LeaderboardResponseDto[]).
export async function getRankingGrupo(grupoId) {
  const response = await apiRequest(`/api/grupos/${grupoId}/leaderboard`, {
    method: "GET",
  });

  return response.data;
}
