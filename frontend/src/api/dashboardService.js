import { apiRequest } from "./apiClient";

// Esto es solo un mock para que el frontend funcione mientras el backend no está implementado Nico.
// ─── Los Endpoints que el backend expondrá cuando estén implementados ───
// Por ahora devuelven datos mock. Para conectar al backend real:
//   1. Descomentar el apiRequest correspondiente
//   2. Borrar el bloque "return { ... }" debajo

export async function fetchDashboardStats() {
  // return (await apiRequest("/api/users/me/stats")).data;
  return {
    totalPoints: 347,
    globalRank: 42,
    exactScores: 8,
    accuracy: 68,
  };
}

export async function fetchActiveMatchday() {
  // return (await apiRequest("/api/matchdays/active")).data;
  return {
    id: 15,
    name: "Fecha 15",
    tournament: "Torneo Clausura 2025",
    predictionsCount: 4,
    matchesCount: 6,
    deadline: "2025-06-20T20:00:00Z",
  };
}

export async function fetchUpcomingMatches() {
  // return (await apiRequest("/api/matchdays/active/matches?status=UPCOMING")).data;
  return [
    {
      id: 1,
      homeTeam: { name: "River Plate" },
      awayTeam: { name: "Boca Juniors" },
      date: "2025-06-20T20:00:00Z",
      venue: "Estadio Monumental",
    },
    {
      id: 2,
      homeTeam: { name: "Racing Club" },
      awayTeam: { name: "Independiente" },
      date: "2025-06-21T17:00:00Z",
      venue: "El Cilindro",
    },
    {
      id: 3,
      homeTeam: { name: "San Lorenzo" },
      awayTeam: { name: "Huracán" },
      date: "2025-06-21T19:30:00Z",
      venue: "Estadio Pedro Bidegain",
    },
    {
      id: 4,
      homeTeam: { name: "Vélez Sársfield" },
      awayTeam: { name: "Gimnasia LP" },
      date: "2025-06-22T15:30:00Z",
      venue: "Estadio José Amalfitani",
    },
  ];
}

export async function fetchRecentPredictions() {
  // return (await apiRequest("/api/users/me/predictions?matchday=active")).data;
  return [
    {
      id: 1,
      homeTeam: "River Plate",
      awayTeam: "San Lorenzo",
      predictedHome: 2,
      predictedAway: 0,
      actualHome: 2,
      actualAway: 0,
      status: "FINISHED",
      points: 3,
    },
    {
      id: 2,
      homeTeam: "Boca Juniors",
      awayTeam: "Racing Club",
      predictedHome: 1,
      predictedAway: 1,
      actualHome: 2,
      actualAway: 0,
      status: "FINISHED",
      points: 1,
    },
    {
      id: 3,
      homeTeam: "Independiente",
      awayTeam: "Vélez Sársfield",
      predictedHome: 0,
      predictedAway: 1,
      actualHome: null,
      actualAway: null,
      status: "LIVE",
      points: null,
    },
    {
      id: 4,
      homeTeam: "Estudiantes LP",
      awayTeam: "Talleres",
      predictedHome: 1,
      predictedAway: 2,
      actualHome: null,
      actualAway: null,
      status: "UPCOMING",
      points: null,
    },
  ];
}

export async function fetchLeaderboard() {
  // return (await apiRequest("/api/leaderboard?limit=7")).data;
  return [
    { rank: 1, name: "GolAdicto99", points: 523 },
    { rank: 2, name: "MisterProde", points: 498 },
    { rank: 3, name: "TácticaTotal", points: 471 },
    { rank: 4, name: "El10Clasico", points: 455 },
    { rank: 5, name: "BalonDeOro", points: 442 },
    { rank: 6, name: "CamisetaVerde", points: 419 },
    { rank: 7, name: "DiezSiempre", points: 408 },
  ];
}

export async function fetchSeasonForm() {
  // return (await apiRequest("/api/users/me/season-form?last=5")).data;
  return ["W", "W", "D", "L", "W"];
}
