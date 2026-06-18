import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import {
  fetchDashboardStats,
  fetchActiveMatchday,
  fetchUpcomingMatches,
  fetchRecentPredictions,
  fetchLeaderboard,
  fetchSeasonForm,
} from "../api/dashboardService";

// ─── Helpers ────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 18) return "Buenas tardes";
  return "Buenas noches";
}

function getDisplayName(token) {
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

function formatDate(iso) {
  const d = new Date(iso);
  const day = d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });
  const time = d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  return { day, time };
}

// ─── Sub-components ──────────────────────────────────────────

function StatusBadge({ status }) {
  const config = {
    UPCOMING: { label: "Próximo",    cls: "upcoming" },
    LIVE:     { label: "En vivo",    cls: "live"     },
    FINISHED: { label: "Finalizado", cls: "finished" },
  };
  const { label, cls } = config[status] ?? { label: status, cls: "upcoming" };
  return <span className={`status-badge status-badge--${cls}`}>{label}</span>;
}

const RANK_CLASS = ["", "gold", "silver", "bronze"];

function LeaderboardItem({ entry }) {
  const rankCls = RANK_CLASS[entry.rank] ?? "";
  return (
    <div className="leaderboard-item">
      <span className={`leaderboard-item__rank${rankCls ? ` leaderboard-item__rank--${rankCls}` : ""}`}>
        #{entry.rank}
      </span>
      <span className="leaderboard-item__name">{entry.name}</span>
      <span className="leaderboard-item__points">{entry.points}</span>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────

export default function DashboardPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats]               = useState(null);
  const [matchday, setMatchday]         = useState(null);
  const [upcomingMatches, setUpcoming]  = useState([]);
  const [predictions, setPredictions]   = useState([]);
  const [leaderboard, setLeaderboard]   = useState([]);
  const [seasonForm, setSeasonForm]     = useState([]);
  const [loading, setLoading]           = useState(true);

  const displayName = getDisplayName(token);
  const greeting    = getGreeting();

  useEffect(() => {
    async function load() {
      try {
        const [s, m, u, p, l, f] = await Promise.all([
          fetchDashboardStats(),
          fetchActiveMatchday(),
          fetchUpcomingMatches(),
          fetchRecentPredictions(),
          fetchLeaderboard(),
          fetchSeasonForm(),
        ]);
        setStats(s);
        setMatchday(m);
        setUpcoming(u);
        setPredictions(p);
        setLeaderboard(l);
        setSeasonForm(f);
      } catch (err) {
        console.error("Error al cargar el dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading__spinner" />
      </div>
    );
  }

  const progressPct = matchday
    ? Math.round((matchday.predictionsCount / matchday.matchesCount) * 100)
    : 0;

  return (
    <div className="dashboard-page">
      {/* ── Header ── */}
      <header className="dashboard-header">
        <img src={logo} alt="Predigol" className="dashboard-header__logo" />
        <button
          className="dashboard-header__logout"
          onClick={() => { logout(); navigate("/login", { replace: true }); }}
        >
          Cerrar sesión
        </button>
      </header>

      {/* ── Body ── */}
      <div className="dashboard-body">

        {/* ══ Main column ══ */}
        <main className="dashboard-main">

          {/* Greeting */}
          <section>
            <h1 className="dash-greeting__name">
              {greeting},{" "}
              <span className="dash-greeting__accent">{displayName}</span>
            </h1>
            <p className="dash-greeting__sub">
              {matchday
                ? `${matchday.name} · ${matchday.tournament} está activa`
                : "No hay una fecha activa en este momento"}
            </p>
          </section>

          {/* Stats */}
          <div className="dash-stats">
            <div className="stat-card">
              <span className="stat-card__label">Puntos totales</span>
              <span className="stat-card__value">{stats?.totalPoints ?? "—"}</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Posición global</span>
              <span className="stat-card__value stat-card__value--lavender">
                #{stats?.globalRank ?? "—"}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Resultados exactos</span>
              <span className="stat-card__value stat-card__value--green">
                {stats?.exactScores ?? "—"}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Precisión</span>
              <span className="stat-card__value">{stats?.accuracy ?? "—"}%</span>
            </div>
          </div>

          {/* Active Matchday */}
          {matchday && (
            <div className="dash-card">
              <p className="dash-card__title">Fecha activa</p>
              <div className="matchday-header">
                <div>
                  <p className="matchday-name">{matchday.name}</p>
                  <p className="matchday-tournament">{matchday.tournament}</p>
                </div>
                <div className="matchday-count">
                  <span className="matchday-count__number">
                    {matchday.predictionsCount}/{matchday.matchesCount}
                  </span>
                  <span className="matchday-count__label">predicciones realizadas</span>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          )}

          {/* Upcoming Matches */}
          {upcomingMatches.length > 0 && (
            <div className="dash-card">
              <p className="dash-card__title">Próximos partidos</p>
              <div className="matches-grid">
                {upcomingMatches.map((match) => {
                  const { day, time } = formatDate(match.date);
                  return (
                    <div key={match.id} className="match-card">
                      <div className="match-card__teams">
                        <span className="match-card__team">{match.homeTeam.name}</span>
                        <span className="match-card__vs">VS</span>
                        <span className="match-card__team match-card__team--away">
                          {match.awayTeam.name}
                        </span>
                      </div>
                      <div className="match-card__meta">
                        <span className="match-card__date">{day} · {time}</span>
                        <span>{match.venue}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Your Predictions */}
          {predictions.length > 0 && (
            <div className="dash-card">
              <p className="dash-card__title">Tus pronósticos</p>
              <div className="predictions-list">
                {predictions.map((pred) => (
                  <div key={pred.id} className="prediction-item">
                    <div className="prediction-item__match">
                      <div className="prediction-item__teams">
                        {pred.homeTeam} vs {pred.awayTeam}
                      </div>
                      <div className="prediction-item__score">
                        Pron.: {pred.predictedHome}–{pred.predictedAway}
                        {pred.status === "FINISHED" && pred.actualHome !== null && (
                          <span className="result">
                            {" "}· Resultado: {pred.actualHome}–{pred.actualAway}
                          </span>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={pred.status} />
                    <div
                      className={`prediction-item__points${
                        pred.points === null ? " prediction-item__points--pending" : ""
                      }`}
                    >
                      {pred.points !== null ? `+${pred.points}` : "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* ══ Sidebar ══ */}
        <aside className="dashboard-sidebar">

          {/* Leaderboard */}
          <div className="dash-card">
            <p className="dash-card__title">Tabla de posiciones</p>
            <div className="leaderboard-list">
              {leaderboard.map((entry) => (
                <LeaderboardItem key={entry.rank} entry={entry} />
              ))}
            </div>
          </div>

          {/* Season Form */}
          <div className="dash-card">
            <p className="dash-card__title">Rendimiento reciente</p>
            <div className="form-chips">
              {seasonForm.map((result, i) => (
                <div
                  key={i}
                  className={`form-chip form-chip--${result.toLowerCase()}`}
                  title={result === "W" ? "Victoria" : result === "D" ? "Empate" : "Derrota"}
                >
                  {result === "W" ? "G" : result === "D" ? "E" : "P"}
                </div>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
