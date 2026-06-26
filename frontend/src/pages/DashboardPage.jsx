import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LeaderboardItem from "../components/LeaderboardItem";
import Sidebar from "../components/Sidebar";
import PredictionBadge from "../components/PredictionBadge";
import PredictModal from "../components/PredictModal";
import TeamBadge from "../components/TeamBadge";
import { getDisplayName, getInitials } from "../utils/profile";
import { formatTime, formatFullMeta, groupByDay } from "../utils/dateFormat";
import {
  fetchDashboardStats,
  fetchJornadaActivaPartidos,
  fetchPreviousMatchday,
  fetchRecentPerformance,
  fetchRecentPredictions,
  fetchLeaderboard,
} from "../api/dashboardService";

// ─── Helpers ────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 18) return "Buenas tardes";
  return "Buenas noches";
}

function pad(n) {
  return String(n).padStart(2, "0");
}

// Cuenta regresiva en vivo hacia targetDate (tickea cada segundo).
function useCountdown(targetDate) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetDate) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate) return null;

  const diffMs = targetDate.getTime() - now;
  if (diffMs <= 0) return { closed: true, label: "00:00:00" };

  const totalSeconds = Math.floor(diffMs / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return { closed: false, label: `${pad(h)}:${pad(m)}:${pad(s)}` };
}

// ─── Sub-componentes ────────────────────────────────────────

function PerfBar({ label, count, total, tone }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="dv-perf-row">
      <span className="dv-perf-label">{label}</span>
      <div className="dv-perf-bar-bg">
        <div className={`dv-perf-bar dv-perf-bar--${tone}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="dv-perf-count">{count}</span>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────

const EMPTY_JORNADA_ACTIVA = { jornada: null, featured: null, pending: [] };

export default function DashboardPage() {
  const { token, rol } = useAuth();
  const isAdmin = rol === "ROLE_ADMIN";
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [jornadaActiva, setJornadaActiva] = useState(EMPTY_JORNADA_ACTIVA);
  const [previousMatchday, setPreviousMatchday] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [lastPredictions, setLastPredictions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [predictTarget, setPredictTarget] = useState(null);

  async function loadDashboard() {
    try {
      const [s, jornadaData, prev, perf, last, lb] = await Promise.all([
        fetchDashboardStats(),
        fetchJornadaActivaPartidos(),
        fetchPreviousMatchday(),
        fetchRecentPerformance(),
        fetchRecentPredictions(3),
        fetchLeaderboard(),
      ]);
      setStats(s);
      setJornadaActiva(jornadaData);
      setPreviousMatchday(prev);
      setPerformance(perf);
      setLastPredictions(last);
      setLeaderboard(lb);
    } catch (err) {
      console.error("Error al cargar el dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  function handlePredictSaved() {
    setPredictTarget(null);
    loadDashboard();
  }

  const displayName = getDisplayName(token, stats?.username);
  const firstName = displayName.split(" ")[0];
  const countdown = useCountdown(jornadaActiva.featured?.closesAt ?? null);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading__spinner" />
      </div>
    );
  }

  return (
    <div className="dv-shell">
      <Sidebar
        displayName={displayName}
        initials={getInitials(displayName)}
        globalRank={stats?.globalRank}
      />

      {/* ── Main ── */}
      <main className="dv-main">
        <h1 className="dv-greeting">
          {getGreeting()}, <span className="dv-greeting__accent">{firstName}</span>
        </h1>
        <p className="dv-sub">
          {jornadaActiva.jornada
            ? `Resumen de ${jornadaActiva.jornada.name}`
            : "No hay una jornada activa en este momento"}
        </p>

        <div className="dv-cols">
          {/* Columna izquierda */}
          <div className="dv-col-left">
            <div className="dv-card">
              <p className="dv-eyebrow">
                {previousMatchday
                  ? `Jornada anterior — ${previousMatchday.jornada.name}, finalizada`
                  : "Jornada anterior"}
              </p>
              {previousMatchday && previousMatchday.items.length > 0 ? (
                previousMatchday.items.map((item) => (
                  <div className="dv-pred-row" key={item.id}>
                    <span className="dv-pred-teams">
                      <TeamBadge {...item.homeTeam} size={18} /> vs{" "}
                      <TeamBadge {...item.awayTeam} size={18} />
                    </span>
                    <span className="dv-pred-score">
                      {item.actualHome} — {item.actualAway}
                    </span>
                    <PredictionBadge
                      prediction={
                        item.prediction
                          ? { status: "FINISHED", points: item.prediction.points }
                          : null
                      }
                    />
                  </div>
                ))
              ) : (
                <p className="dv-empty">Todavía no hay jornadas finalizadas.</p>
              )}
            </div>

            <div className="dv-card">
              <p className="dv-eyebrow">
                Rendimiento reciente (últimos {performance?.total ?? 0})
              </p>
              <PerfBar
                label="Exacto"
                count={performance?.exacto ?? 0}
                total={performance?.total ?? 0}
                tone="green"
              />
              <PerfBar
                label="Tendencia"
                count={performance?.tendencia ?? 0}
                total={performance?.total ?? 0}
                tone="lavender"
              />
              <PerfBar
                label="Sin acierto"
                count={performance?.sinAcierto ?? 0}
                total={performance?.total ?? 0}
                tone="gray"
              />

              <div className="dv-divider" />
              <p className="dv-eyebrow">Tus últimos pronósticos</p>
              {lastPredictions.length > 0 ? (
                lastPredictions.map((p) => (
                  <div className="dv-pred-row" key={p.id}>
                    <span className="dv-pred-teams">
                      <TeamBadge {...p.homeTeam} size={18} /> vs{" "}
                      <TeamBadge {...p.awayTeam} size={18} />
                    </span>
                    <span className="dv-pred-score">
                      {p.predictedHome} — {p.predictedAway}
                    </span>
                    <PredictionBadge prediction={p} />
                  </div>
                ))
              ) : (
                <p className="dv-empty">Todavía no hiciste ningún pronóstico.</p>
              )}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="dv-col-right">
            {jornadaActiva.featured ? (
              <div className="dv-feature-card">
                <p className="dv-feature-eyebrow">
                  Próximo partido{jornadaActiva.jornada ? ` · ${jornadaActiva.jornada.name}` : ""}
                </p>
                <div className="dv-feature-matchup">
                  <div className="dv-feature-team">
                    <TeamBadge {...jornadaActiva.featured.homeTeam} size={40} showName={false} />
                    <div>{jornadaActiva.featured.homeTeam.name}</div>
                  </div>
                  <div className="dv-feature-vs">VS</div>
                  <div className="dv-feature-team">
                    <TeamBadge {...jornadaActiva.featured.awayTeam} size={40} showName={false} />
                    <div>{jornadaActiva.featured.awayTeam.name}</div>
                  </div>
                </div>
                <div
                  className={`dv-feature-clock${
                    countdown?.closed ? " dv-feature-clock--closed" : ""
                  }`}
                >
                  {countdown?.label ?? "—"}
                </div>
                <p className="dv-feature-clock-label">
                  {countdown?.closed
                    ? "pronósticos cerrados"
                    : "para el cierre de pronósticos"}
                </p>
                <p className="dv-feature-meta">{formatFullMeta(jornadaActiva.featured.date)}</p>
                {!isAdmin && (
                  <button
                    className="dv-btn-cyan"
                    disabled={countdown?.closed}
                    onClick={() => setPredictTarget(jornadaActiva.featured)}
                  >
                    {countdown?.closed ? "Cerrado" : "Predecir"}
                  </button>
                )}
              </div>
            ) : (
              <div className="dv-card">
                <p className="dv-empty">No hay un próximo partido pendiente.</p>
              </div>
            )}

            <div className="dv-card">
              <p className="dv-eyebrow">Partidos de la fecha — pendientes de predecir</p>
              {jornadaActiva.pending.length > 0 ? (
                groupByDay(jornadaActiva.pending).map((group) => (
                  <div key={group.label}>
                    <p className="dv-day-label">{group.label}</p>
                    {group.matches.map((match) => (
                      <div className="dv-pending-row" key={match.id}>
                        <span className="dv-pending-time">{formatTime(match.date)}</span>
                        <span className="dv-pending-teams">
                          <TeamBadge {...match.homeTeam} size={18} /> vs{" "}
                          <TeamBadge {...match.awayTeam} size={18} />
                        </span>
                        {!isAdmin && (
                          <button
                            className="dv-pending-cta"
                            onClick={() => setPredictTarget(match)}
                          >
                            Predecir
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p className="dv-empty">
                  No te quedan partidos pendientes por predecir en esta fecha.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── Rail de posiciones ── */}
      <aside className="dv-rail">
        <p className="dv-rail-title">Posiciones</p>
        <p className="dv-rail-sub">Ranking general</p>
        <div className="dv-rail-list">
          {leaderboard.map((entry) => (
            <LeaderboardItem
              key={entry.rank}
              entry={entry}
              highlight={Boolean(stats?.username) && entry.name === stats.username}
            />
          ))}
        </div>
        <button className="dv-btn-outline" onClick={() => navigate("/grupos")}>
          Ir a grupo →
        </button>
      </aside>

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
