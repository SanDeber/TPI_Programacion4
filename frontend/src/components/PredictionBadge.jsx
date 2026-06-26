// ============================================================
// PredictionBadge.jsx
// ============================================================
// Badge de puntos/estado de un pronóstico, compartido entre
// DashboardPage y PrediccionesPage.
// Espera prediction = { status: "UPCOMING"|"LIVE"|"FINISHED", points } | null.
// ============================================================

export function badgeTone(points) {
  if (points >= 3) return "green";
  if (points > 0) return "lavender";
  return "muted";
}

export default function PredictionBadge({ prediction }) {
  if (!prediction) {
    return <span className="dv-pred-badge dv-pred-badge--muted">sin pronóstico</span>;
  }
  if (prediction.status === "LIVE") {
    return <span className="dv-pred-badge dv-pred-badge--muted">en vivo</span>;
  }
  if (prediction.status === "UPCOMING") {
    return <span className="dv-pred-badge dv-pred-badge--muted">próximo</span>;
  }
  const points = prediction.points ?? 0;
  return (
    <span className={`dv-pred-badge dv-pred-badge--${badgeTone(points)}`}>+{points}</span>
  );
}
