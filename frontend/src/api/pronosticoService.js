import { apiRequest } from "./apiClient";
import { invalidateDashboardCache } from "./dashboardService";

// POST /api/pronosticos -> crea o actualiza (upsert) el pronóstico del
// usuario logueado para un partido. Requiere ROLE_USER.
export async function createPronostico(partidoId, golesLocales, golesVisitantes) {
  const response = await apiRequest("/api/pronosticos", {
    method: "POST",
    body: JSON.stringify({ partidoId, golesLocales, golesVisitantes }),
  });

  // dashboardService cachea mis-pronosticos/leaderboard por unos
  // segundos (ver invalidateDashboardCache); si no invalidamos acá,
  // la pantalla podría seguir mostrando el estado previo a este
  // pronóstico durante ese lapso.
  invalidateDashboardCache();

  // response.data = { pronostico: PronosticoResponseDto, created: boolean }
  return response.data;
}
