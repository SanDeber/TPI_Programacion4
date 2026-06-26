// ============================================================
// profile.js
// ============================================================
// Resolución de nombre/iniciales del usuario, compartida por el
// Sidebar y cualquier página que lo necesite.
// ============================================================

// Prioriza el nombre real (nameUser, vía leaderboard/pronosticos) y si
// todavía no hay ninguno (usuario sin pronósticos) cae al email del JWT.
export function getDisplayName(token, username) {
  if (username) return username;
  if (!token) return "Jugador";
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { sub = "" } = JSON.parse(atob(base64));
    const raw = sub.split("@")[0].replace(/[._-]/g, " ");
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  } catch {
    return "Jugador";
  }
}

export function getInitials(name) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}
