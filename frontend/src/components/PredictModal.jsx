import { useState } from "react";
import { createPronostico } from "../api/pronosticoService";

// ============================================================
// PredictModal.jsx
// ============================================================
// Modal para cargar un pronóstico, compartido entre DashboardPage
// y PrediccionesPage (RF5.2) — no duplicar este componente.
// Espera partido = { id, homeTeam: {name}, awayTeam: {name} }.
// ============================================================
export default function PredictModal({ partido, onClose, onSaved }) {
  const [golesLocal, setGolesLocal] = useState("");
  const [golesVisitante, setGolesVisitante] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (golesLocal === "" || golesVisitante === "") {
      setError("Completá los dos resultados");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await createPronostico(partido.id, Number(golesLocal), Number(golesVisitante));
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dv-modal-overlay" onClick={onClose}>
      <div className="dv-modal" onClick={(event) => event.stopPropagation()}>
        <p className="dv-modal__title">
          {partido.homeTeam.name} <span>vs</span> {partido.awayTeam.name}
        </p>
        <form onSubmit={handleSubmit}>
          {error && <div className="form-error-banner">{error}</div>}
          <div className="dv-modal__score-inputs">
            <input
              type="number"
              min="0"
              inputMode="numeric"
              aria-label="Goles equipo local"
              value={golesLocal}
              onChange={(e) => setGolesLocal(e.target.value)}
            />
            <span>—</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              aria-label="Goles equipo visitante"
              value={golesVisitante}
              onChange={(e) => setGolesVisitante(e.target.value)}
            />
          </div>
          <div className="dv-modal__actions">
            <button type="button" className="dv-btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="dv-btn-cyan" disabled={loading}>
              {loading ? "Guardando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
