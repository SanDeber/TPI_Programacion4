import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import PredictionBadge from "../components/PredictionBadge";
import PredictModal from "../components/PredictModal";
import TeamBadge from "../components/TeamBadge";
import { getDisplayName, getInitials } from "../utils/profile";
import { formatFullMeta } from "../utils/dateFormat";
import { fetchDashboardStats } from "../api/dashboardService";
import { fetchTodosLosPartidos } from "../api/prediccionesService";

// ============================================================
// PrediccionesPage.jsx — RF5.2 "Mis pronósticos"
// ============================================================
// A diferencia del Dashboard (que solo muestra la jornada activa),
// esta pantalla trae TODOS los partidos de TODAS las jornadas
// (fetchTodosLosPartidos hace un solo fetch; el filtro de abajo
// solo recorta lo ya cargado, sin pegarle de nuevo al backend).
// ============================================================

const FILTERS = [
  { key: "TODOS", label: "Todos" },
  { key: "UPCOMING", label: "Por jugarse" },
  { key: "LIVE", label: "En juego" },
  { key: "FINISHED", label: "Finalizados" },
];

const ESTADO_LABEL = {
  PROGRAMADA: "programada",
  EN_JUEGO: "en juego",
  FINALIZADA: "finalizada",
};

const CIERRE_MINUTOS = 30;

function estaCerrado(iso) {
  const closesAt = new Date(iso).getTime() - CIERRE_MINUTOS * 60 * 1000;
  return Date.now() >= closesAt;
}

function PrediccionRow({ match, onPredict }) {
  const { rol } = useAuth();
  const isAdmin = rol === "ROLE_ADMIN";
  const { status, prediction } = match;

  if (status === "FINISHED") {
    return (
      <div className="dv-pred-row">
        <span className="dv-pred-teams">
          <TeamBadge {...match.homeTeam} size={18} /> vs <TeamBadge {...match.awayTeam} size={18} />
        </span>
        <span className="dv-pred-score">
          {match.actualHome} — {match.actualAway}
          {prediction && (
            <span className="dv-pred-score__mine">
              {" "}
              (vos: {prediction.predictedHome}-{prediction.predictedAway})
            </span>
          )}
        </span>
        <PredictionBadge
          prediction={
            prediction ? { status: "FINISHED", points: prediction.points } : null
          }
        />
      </div>
    );
  }

  if (status === "LIVE") {
    return (
      <div className="dv-pred-row">
        <span className="dv-pred-teams">
          <TeamBadge {...match.homeTeam} size={18} /> vs <TeamBadge {...match.awayTeam} size={18} />
        </span>
        <span className="dv-pred-score">
          {prediction
            ? `Tu pronóstico: ${prediction.predictedHome} — ${prediction.predictedAway}`
            : "—"}
        </span>
        <PredictionBadge prediction={{ status: "LIVE" }} />
      </div>
    );
  }

  // status === "UPCOMING" (POR_JUGARSE)
  if (prediction) {
    return (
      <div className="dv-pred-row">
        <span className="dv-pred-teams">
          <TeamBadge {...match.homeTeam} size={18} /> vs <TeamBadge {...match.awayTeam} size={18} />
        </span>
        <span className="dv-pred-score">
          Tu pronóstico: {prediction.predictedHome} — {prediction.predictedAway}
        </span>
        <span className="dv-pred-badge dv-pred-badge--muted">próximo</span>
      </div>
    );
  }

  if (estaCerrado(match.date)) {
    return (
      <div className="dv-pred-row">
        <span className="dv-pred-teams">
          <TeamBadge {...match.homeTeam} size={18} /> vs <TeamBadge {...match.awayTeam} size={18} />
        </span>
        <span className="dv-pred-score">{formatFullMeta(match.date)}</span>
        <span className="dv-pred-badge dv-pred-badge--muted">Cerrado</span>
      </div>
    );
  }

  return (
    <div className="dv-pred-row">
      <span className="dv-pred-teams">
        <TeamBadge {...match.homeTeam} size={18} /> vs <TeamBadge {...match.awayTeam} size={18} />
      </span>
      <span className="dv-pred-score">{formatFullMeta(match.date)}</span>
      {!isAdmin && (
        <button className="dv-pending-cta" onClick={() => onPredict(match)}>
          Predecir
        </button>
      )}
    </div>
  );
}

export default function PrediccionesPage() {
  const { token } = useAuth();

  const [stats, setStats] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("TODOS");
  const [predictTarget, setPredictTarget] = useState(null);

  async function load() {
    try {
      const [s, g] = await Promise.all([fetchDashboardStats(), fetchTodosLosPartidos()]);
      setStats(s);
      setGrupos(g);
    } catch (err) {
      console.error("Error al cargar mis pronósticos:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handlePredictSaved() {
    setPredictTarget(null);
    load();
  }

  const displayName = getDisplayName(token, stats?.username);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading__spinner" />
      </div>
    );
  }

  // El filtro solo recorta los datos ya cargados en "grupos", sin
  // volver a pedirle nada al backend.
  const gruposFiltrados = grupos
    .map((grupo) => ({
      ...grupo,
      partidos:
        filter === "TODOS"
          ? grupo.partidos
          : grupo.partidos.filter((p) => p.status === filter),
    }))
    .filter((grupo) => grupo.partidos.length > 0);

  return (
    <div className="dv-shell">
      <Sidebar
        displayName={displayName}
        initials={getInitials(displayName)}
        globalRank={stats?.globalRank}
      />

      <main className="dv-main">
        <h1 className="dv-greeting">Pronósticos</h1>
        <p className="dv-sub">Todos los partidos de todas las jornadas.</p>

        <div className="dv-filter-bar">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`dv-filter${filter === f.key ? " dv-filter--active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {gruposFiltrados.length === 0 ? (
          <div className="dv-card">
            <p className="dv-empty">No hay partidos para este filtro.</p>
          </div>
        ) : (
          gruposFiltrados.map(({ jornada, partidos }) => (
            <div className="dv-card" key={jornada.id} style={{ marginBottom: "1rem" }}>
              <p className="dv-eyebrow">
                {jornada.name} — {ESTADO_LABEL[jornada.estado] ?? jornada.estado}
              </p>
              {partidos.map((match) => (
                <PrediccionRow key={match.id} match={match} onPredict={setPredictTarget} />
              ))}
            </div>
          ))
        )}
      </main>

      {predictTarget && (
        <PredictModal
          partido={predictTarget}
          onClose={() => setPredictTarget(null)}
          onSaved={handlePredictSaved}
        />
      )}
    </div>
  );
}
