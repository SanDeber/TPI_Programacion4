// ============================================================
// dateFormat.js
// ============================================================
// Helpers de fecha/hora compartidos entre DashboardPage y
// PrediccionesPage, para no duplicar el mismo formateo en ambas.
// ============================================================

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDayLabel(iso) {
  const label = new Date(iso).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatFullMeta(iso) {
  return `${formatDayLabel(iso)} · ${formatTime(iso)} hs`;
}

// Agrupa partidos (ya ordenados cronológicamente) por día calendario,
// preservando el orden.
export function groupByDay(matches) {
  const groups = [];
  let lastKey = null;
  matches.forEach((match) => {
    const key = new Date(match.date).toDateString();
    if (key !== lastKey) {
      groups.push({ label: formatDayLabel(match.date), matches: [] });
      lastKey = key;
    }
    groups[groups.length - 1].matches.push(match);
  });
  return groups;
}
