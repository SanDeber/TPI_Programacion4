import { apiRequest } from "./apiClient";

// ============================================================
// dashboardService.js
// ============================================================
// Todo lo que el dashboard necesita, armado a partir de los
// endpoints reales del backend (ver ENDPOINTS.md). El backend NO
// tiene endpoints dedicados de dashboard, así que esto se deriva en
// el cliente combinando /api/jornadas, /api/partidos,
// /api/pronosticos/mis-pronosticos y /api/leaderboard.
//
// Todos los GET de abajo requieren estar autenticado (no son
// públicos - ver corrección en ENDPOINTS.md), por eso usamos
// apiRequest, que ya manda el Bearer token igual que en
// equipoService/jornadaService/partidoService/grupoService.
// ============================================================

const ESTADO_PARTIDO_TO_STATUS = {
  POR_JUGARSE: "UPCOMING",
  EN_JUEGO: "LIVE",
  FINALIZADO: "FINISHED",
};

// PartidoResponseDto -> shape que usan las cards de partido del dashboard.
// Exportada porque prediccionesService la reusa para "Mis pronósticos".
export function mapPartidoToUI(partido) {
  return {
    id: partido.id,
    homeTeam: { name: partido.equipoLocal.nombre, escudo: partido.equipoLocal.escudo },
    awayTeam: {
      name: partido.equipoVisitante.nombre,
      escudo: partido.equipoVisitante.escudo,
    },
    date: partido.fechaInicio,
    // El backend no expone una sede del partido en PartidoResponseDto.
    venue: "",
    actualHome: partido.golesLocal,
    actualAway: partido.golesVisitante,
    status: ESTADO_PARTIDO_TO_STATUS[partido.estado] ?? "UPCOMING",
  };
}

// PronosticoResponseDto -> shape que espera la lista "Tus últimos pronósticos".
function mapPronosticoToUI(pronostico) {
  const partido = pronostico.partido;
  return {
    // PronosticoResponseDto no tiene id propio; el id del partido sirve
    // de key porque hay un único pronóstico por (usuario, partido).
    id: partido.id,
    homeTeam: { name: partido.equipoLocal.nombre, escudo: partido.equipoLocal.escudo },
    awayTeam: {
      name: partido.equipoVisitante.nombre,
      escudo: partido.equipoVisitante.escudo,
    },
    predictedHome: pronostico.golesLocal,
    predictedAway: pronostico.golesVisitante,
    actualHome: partido.golesLocal,
    actualAway: partido.golesVisitante,
    status: ESTADO_PARTIDO_TO_STATUS[partido.estado] ?? "UPCOMING",
    points: pronostico.puntosGanados ?? null,
  };
}

// LeaderboardResponseDto -> shape que espera <LeaderboardItem>.
// Exportada porque GruposPage la reusa para el ranking por grupo
// (misma forma de respuesta que el leaderboard global).
export function mapLeaderboardEntryToUI(entry) {
  return {
    rank: entry.posicion,
    name: entry.username,
    points: entry.puntosTotales,
  };
}

// Compara el pronóstico contra el resultado real del partido.
// Devuelve null si el partido todavía no tiene resultado cargado.
function clasificarPronostico(pronostico) {
  const { golesLocal: predLocal, golesVisitante: predVisitante } = pronostico;
  const { golesLocal: realLocal, golesVisitante: realVisitante } = pronostico.partido;

  if (realLocal == null || realVisitante == null) return null;
  if (predLocal === realLocal && predVisitante === realVisitante) return "EXACTO";

  const tendenciaPred = Math.sign(predLocal - predVisitante);
  const tendenciaReal = Math.sign(realLocal - realVisitante);
  return tendenciaPred === tendenciaReal ? "TENDENCIA" : "SIN_ACIERTO";
}

// El backend restringe estos dos endpoints a ROLE_USER específicamente
// (un ADMIN logueado recibe "Access Denied", no solo un USER sin
// pronósticos). Como Sidebar/AdminPage/GruposPage también llaman a
// fetchDashboardStats() para el perfil, no podemos dejar que esto
// rompa el Promise.all entero cuando el usuario es ADMIN: lo tratamos
// igual que "todavía no hay datos".
//
// Además, estos dos endpoints son lentos en el backend (~1.5-2s cada
// uno) y CADA función de este archivo (fetchDashboardStats,
// fetchJornadaActivaPartidos, fetchPreviousMatchday,
// fetchRecentPerformance, fetchRecentPredictions, fetchLeaderboard)
// los vuelve a pedir de cero. Sumado al límite de ~6 conexiones
// concurrentes por origen del browser, navegar rápido entre páginas
// (que cada una dispara su propio Promise.all) hacía que los pedidos
// de la página nueva quedaran en cola detrás de los de la anterior y
// tardaran varios segundos en resolver. Cacheamos la respuesta por
// pocos segundos y la invalidamos explícitamente al crear un
// pronóstico (ver pronosticoService.js) para no mostrar datos viejos.
const CACHE_TTL_MS = 4000;
let pronosticosCache = null;
let leaderboardCache = null;

export function invalidateDashboardCache() {
  pronosticosCache = null;
  leaderboardCache = null;
}

// Exportada porque prediccionesService la reusa (en vez de duplicarla).
export async function getMisPronosticos() {
  if (pronosticosCache && Date.now() - pronosticosCache.time < CACHE_TTL_MS) {
    return pronosticosCache.promise;
  }
  const promise = apiRequest("/api/pronosticos/mis-pronosticos", { method: "GET" })
    .then((response) => response.data)
    .catch(() => []);
  pronosticosCache = { promise, time: Date.now() };
  return promise;
}

async function getLeaderboardCompleto() {
  if (leaderboardCache && Date.now() - leaderboardCache.time < CACHE_TTL_MS) {
    return leaderboardCache.promise;
  }
  const promise = apiRequest("/api/leaderboard", { method: "GET" })
    .then((response) => response.data)
    .catch(() => []);
  leaderboardCache = { promise, time: Date.now() };
  return promise;
}

// El backend, en vez de devolver un array vacío cuando ningún registro
// matchea el filtro "estado", a veces tira un 500
// ("No se a encontrado jornada existente"). Lo tratamos como "sin
// resultados" en vez de dejar que reviente la carga del dashboard.
async function getJornadasPorEstado(estado) {
  try {
    const response = await apiRequest(`/api/jornadas?estado=${estado}`, {
      method: "GET",
    });
    return response.data;
  } catch {
    return [];
  }
}

// No siempre hay una jornada EN_JUEGO; si no hay ninguna activa,
// probamos con la próxima PROGRAMADA para no dejar el dashboard vacío.
async function getJornadaActiva() {
  const enJuego = await getJornadasPorEstado("EN_JUEGO");
  if (enJuego.length > 0) return enJuego[0];

  const programadas = await getJornadasPorEstado("PROGRAMADA");
  return programadas[0] ?? null;
}

// "Última" jornada finalizada = la de id más alto entre las FINALIZADA
// (el backend no expone una fecha de cierre de jornada para ordenar por
// eso, y los ids se asignan en orden de creación).
async function getUltimaJornadaFinalizada() {
  const finalizadas = await getJornadasPorEstado("FINALIZADA");
  if (finalizadas.length === 0) return null;
  return finalizadas.reduce((max, j) => (j.id > max.id ? j : max));
}

// Mismo problema que en getJornadasPorEstado: el backend devuelve 500
// ("No se encontro ningun partido...") en vez de un array vacío cuando
// la jornada no tiene partidos todavía.
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

export async function fetchDashboardStats() {
  const pronosticos = await getMisPronosticos();

  if (pronosticos.length === 0) {
    return {
      totalPoints: 0,
      globalRank: null,
      exactScores: 0,
      accuracy: 0,
      username: null,
    };
  }

  // mis-pronosticos solo trae pronósticos del usuario logueado, así que
  // todos comparten el mismo "nameUser": lo usamos para encontrar su
  // fila en la tabla de posiciones global (que identifica por username)
  // y como nombre real para mostrar en el perfil de la sidebar.
  const nameUser = pronosticos[0].nameUser;
  const leaderboard = await getLeaderboardCompleto();
  const myRow = leaderboard.find((entry) => entry.username === nameUser);

  const finalizados = pronosticos.filter(
    (p) => p.partido.estado === "FINALIZADO"
  );
  const accuracy =
    finalizados.length > 0
      ? Math.round(
          (finalizados.filter((p) => (p.puntosGanados ?? 0) > 0).length /
            finalizados.length) *
            100
        )
      : 0;

  return {
    totalPoints: myRow?.puntosTotales ?? 0,
    globalRank: myRow?.posicion ?? null,
    exactScores: myRow?.cantidadExactos ?? 0,
    accuracy,
    username: nameUser,
  };
}

// Devuelve, para la jornada activa (o la próxima PROGRAMADA si no hay
// ninguna EN_JUEGO):
//   - featured: el partido "Por jugarse" con fechaInicio más próxima,
//     con closesAt = fechaInicio - 30min (cierre de pronósticos).
//   - pending: el resto de los partidos "Por jugarse" que el usuario
//     todavía no pronosticó, en orden cronológico.
export async function fetchJornadaActivaPartidos() {
  const jornada = await getJornadaActiva();
  if (!jornada) return { jornada: null, featured: null, pending: [] };

  const [partidos, pronosticos] = await Promise.all([
    getPartidosDeJornada(jornada.id),
    getMisPronosticos(),
  ]);

  const idsConPronostico = new Set(pronosticos.map((p) => p.partido.id));
  const porJugarse = partidos
    .filter((p) => p.estado === "POR_JUGARSE")
    .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));

  const proximo = porJugarse[0] ?? null;
  const featured = proximo
    ? {
        ...mapPartidoToUI(proximo),
        closesAt: new Date(
          new Date(proximo.fechaInicio).getTime() - 30 * 60 * 1000
        ),
      }
    : null;

  const pending = porJugarse
    .filter((p) => p.id !== proximo?.id && !idsConPronostico.has(p.id))
    .map(mapPartidoToUI);

  return { jornada, featured, pending };
}

// Todos los partidos de la última jornada finalizada, con el pronóstico
// del usuario si lo tiene (o null para mostrar el badge "sin pronóstico").
export async function fetchPreviousMatchday() {
  const jornada = await getUltimaJornadaFinalizada();
  if (!jornada) return null;

  const [partidos, pronosticos] = await Promise.all([
    getPartidosDeJornada(jornada.id),
    getMisPronosticos(),
  ]);

  const pronosticoPorPartido = new Map(pronosticos.map((p) => [p.partido.id, p]));

  const items = partidos
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

  return { jornada: { id: jornada.id, name: jornada.name }, items };
}

// Exacto / tendencia / sin acierto sobre los últimos 5 pronósticos
// finalizados del usuario (comparando contra el resultado real).
export async function fetchRecentPerformance() {
  const pronosticos = await getMisPronosticos();

  const finalizados = pronosticos
    .filter((p) => p.partido.estado === "FINALIZADO")
    .sort(
      (a, b) => new Date(b.partido.fechaInicio) - new Date(a.partido.fechaInicio)
    )
    .slice(0, 5);

  const counts = { EXACTO: 0, TENDENCIA: 0, SIN_ACIERTO: 0 };
  finalizados.forEach((p) => {
    const resultado = clasificarPronostico(p);
    if (resultado) counts[resultado] += 1;
  });

  return {
    exacto: counts.EXACTO,
    tendencia: counts.TENDENCIA,
    sinAcierto: counts.SIN_ACIERTO,
    total: finalizados.length,
  };
}

// Últimos N pronósticos del usuario (cualquier estado), más recientes
// primero.
export async function fetchRecentPredictions(limit = 5) {
  const pronosticos = await getMisPronosticos();

  return pronosticos
    .slice()
    .sort(
      (a, b) => new Date(b.partido.fechaInicio) - new Date(a.partido.fechaInicio)
    )
    .slice(0, limit)
    .map(mapPronosticoToUI);
}

// Leaderboard global completo (sin recortar): el rail de posiciones
// decide cuánto mostrar/scrollear según el alto disponible, no al revés.
export async function fetchLeaderboard() {
  const leaderboard = await getLeaderboardCompleto();
  return leaderboard.map(mapLeaderboardEntryToUI);
}
