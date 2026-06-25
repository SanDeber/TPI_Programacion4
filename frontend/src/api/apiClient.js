// ============================================================
// apiClient.js
// ============================================================
// Wrapper chiquito sobre `fetch` para no repetir código en cada
// llamada al backend. Se encarga de:
//   - armar la URL completa
//   - mandar/recibir JSON
//   - intentar extraer un mensaje de error "humano" sin importar
//     el formato exacto en el que responda el backend (esto es
//     útil porque el backend todavía está mejorando su manejo de
//     errores global, así que cubrimos varios formatos posibles).
// ============================================================

// Base de la API. En desarrollo, Vite redirige "/api" al backend
// (ver vite.config.js), así que dejamos la base vacía por defecto.
// Si en producción el backend vive en otro dominio, basta con
// definir VITE_API_URL en un archivo .env.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

/**
 * Intenta sacar un mensaje de error legible del cuerpo de la
 * respuesta del backend, sea cual sea su forma:
 *  - { message: "..." }                          (BaseResponse / validaciones)
 *  - { error: "..." }                            (handler genérico de excepciones)
 *  - { errors: { campo: "mensaje" } }            (errores de validación por campo)
 *  - { errors: ["mensaje1", "mensaje2"] }        (lista de errores)
 *  - cualquier otra cosa -> mensaje genérico
 */
function extractErrorMessage(body, fallback) {
  if (!body) return fallback;

  if (typeof body.message === "string" && body.message.trim()) {
    return body.message;
  }

  if (typeof body.error === "string" && body.error.trim()) {
    return body.error;
  }

  if (body.errors) {
    if (Array.isArray(body.errors) && body.errors.length > 0) {
      return body.errors[0];
    }
    if (typeof body.errors === "object") {
      const firstKey = Object.keys(body.errors)[0];
      if (firstKey) return body.errors[firstKey];
    }
  }

  return fallback;
}

/**
 * Hace un request HTTP y devuelve el JSON parseado.
 * Si la respuesta no es 2xx, lanza un Error con un mensaje
 * legible (extraído con extractErrorMessage) para que los
 * componentes lo puedan mostrar directo en el formulario.
 *
 * @param {string} path   - ej: "/api/auth/login"
 * @param {object} options - mismas opciones que fetch (method, body, etc.)
 */
export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("predigol_token");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  });

  // El backend siempre responde JSON, pero por si acaso fallara
  // el parseo (ej. el server cayó y devolvió HTML), lo contemplamos.
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const fallback = `Error inesperado (HTTP ${response.status}). Intentá nuevamente.`;
    throw new Error(extractErrorMessage(body, fallback));
  }

  return body;
}
