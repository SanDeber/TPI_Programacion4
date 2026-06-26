import { apiRequest } from "./apiClient";

// GET /api/partidos?fechaId={id} -> partidos de una jornada.
// "fechaId" es en realidad el id de la Jornada (así lo nombra el backend).
export async function getPartidos(fechaId) {
  const query = fechaId ? `?fechaId=${fechaId}` : "";
  const response = await apiRequest(`/api/partidos${query}`, {
    method: "GET",
  });

  return response.data;
}

// POST /api/partidos -> crea un partido (solo ADMIN).
// El backend espera { jornadaId, equipoLocalId, equipoVisitanteId, dateTime }.
export async function createPartido({
  jornadaId,
  equipoLocalId,
  equipoVisitanteId,
  dateTime,
}) {
  const response = await apiRequest("/api/partidos", {
    method: "POST",
    body: JSON.stringify({
      jornadaId,
      equipoLocalId,
      equipoVisitanteId,
      dateTime,
    }),
  });

  return response.data;
}

// PATCH /api/partidos/{id} -> actualiza equipos y/o fecha de un partido (solo ADMIN).
// OJO: a diferencia del create, este endpoint usa "fechaInicio" para la fecha
// (NO "dateTime"), y no acepta jornadaId.
export async function updatePartido(id, { equipoLocalId, equipoVisitanteId, fechaInicio }) {
  const response = await apiRequest(`/api/partidos/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      equipoLocalId,
      equipoVisitanteId,
      fechaInicio,
    }),
  });

  return response.data;
}

// PATCH /api/partidos/{id}/estado -> inicia un partido (solo ADMIN).
// El backend SOLO permite POR_JUGARSE -> EN_JUEGO (cualquier otro valor,
// o un partido que no esté POR_JUGARSE, tira error). No hay forma de
// volver atrás ni de saltar directo a FINALIZADO por este endpoint.
export async function iniciarPartido(id) {
  const response = await apiRequest(`/api/partidos/${id}/estado`, {
    method: "PATCH",
    body: JSON.stringify({ estado: "EN_JUEGO" }),
  });

  return response.data;
}

// PATCH /api/partidos/{id}/resultado -> carga el resultado final (solo ADMIN).
// Requiere que el partido esté EN_JUEGO. El backend hace TODO el resto
// automáticamente: pasa el partido a FINALIZADO, calcula los puntos de
// cada pronóstico (comparando contra el resultado real) y recalcula el
// estado de la jornada (pasa a FINALIZADA si todos sus partidos ya
// terminaron). El frontend no tiene que disparar ningún paso adicional.
export async function cargarResultado(id, golesLocales, golesVisitantes) {
  const response = await apiRequest(`/api/partidos/${id}/resultado`, {
    method: "PATCH",
    body: JSON.stringify({ golesLocales, golesVisitantes }),
  });

  return response.data;
}

// DELETE /api/partidos/{id} -> soft delete (solo ADMIN). El backend rechaza
// el borrado si el partido no está "Por jugarse" (en juego o finalizado),
// o si ya tiene algún pronóstico cargado.
export async function deletePartido(id) {
  const response = await apiRequest(`/api/partidos/${id}`, {
    method: "DELETE",
  });

  return response.data;
}
