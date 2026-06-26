import { apiRequest } from "./apiClient";
import { mapPartidoToUI, getMisPronosticos } from "./dashboardService";

// ============================================================
// prediccionesService.js
// ============================================================
// RF5.2 - "Mis pronósticos": a diferencia de dashboardService
// (que solo mira la jornada activa), esto trae TODOS los partidos
// de TODAS las jornadas, agrupados por jornada, con el pronóstico
// del usuario si existe.
// ============================================================

async function getTodasLasJornadas() {
  // Sin query param "estado" -> el backend devuelve todas, de
  // cualquier estado (PROGRAMADA / EN_JUEGO / FINALIZADA).
  const response = await apiRequest("/api/jornadas", { method: "GET" });
  return response.data;
}

// El backend devuelve 500 (en vez de array vacío) cuando una jornada
// no tiene partidos. Lo tratamos como "sin partidos".
async function getPartidosDeJornada(jornadaId) {
  try {
    const response = await apiRequest(`/api/partidos?fechaId=${jornadaId}`, {
      method: "GET",
    });
    return response.data;
  } catch {
    return [];
  }
}

// Devuelve un array de grupos { jornada: {id,name,estado}, partidos: [...] },
// uno por cada jornada que tenga al menos un partido, en orden
// cronológico (según el partido más temprano de cada jornada). Cada
// partido trae mapPartidoToUI(...) + "prediction" (el pronóstico del
// usuario para ese partido, o null si no pronosticó).
export async function fetchTodosLosPartidos() {
  const jornadas = await getTodasLasJornadas();

  const [partidosPorJornada, pronosticos] = await Promise.all([
    Promise.all(jornadas.map((jornada) => getPartidosDeJornada(jornada.id))),
    getMisPronosticos(),
  ]);

  const pronosticoPorPartido = new Map(pronosticos.map((p) => [p.partido.id, p]));

  const grupos = jornadas
    .map((jornada, index) => {
      const partidos = partidosPorJornada[index]
        .slice()
        .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
        .map((partido) => {
          const pronostico = pronosticoPorPartido.get(partido.id);
          return {
            ...mapPartidoToUI(partido),
            prediction: pronostico
              ? {
                  predictedHome: pronostico.golesLocal,
                  predictedAway: pronostico.golesVisitante,
                  points: pronostico.puntosGanados ?? null,
                }
              : null,
          };
        });
      return { jornada, partidos };
    })
    .filter((grupo) => grupo.partidos.length > 0);

  grupos.sort((a, b) => new Date(a.partidos[0].date) - new Date(b.partidos[0].date));

  return grupos;
}
