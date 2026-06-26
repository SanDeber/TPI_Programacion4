import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import FormField from "../components/FormField";
import LeaderboardItem from "../components/LeaderboardItem";
import { getDisplayName, getInitials } from "../utils/profile";
import { fetchDashboardStats, mapLeaderboardEntryToUI } from "../api/dashboardService";
import { createGrupo, joinGrupo, getRankingGrupo, getMisGrupos } from "../api/grupoService";

export default function GruposPage() {
  const { token, rol } = useAuth();
  const isAdmin = rol === "ROLE_ADMIN";
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  // ---------------- Mis grupos ----------------
  const [misGrupos, setMisGrupos] = useState([]);
  const [misGruposLoading, setMisGruposLoading] = useState(true);
  const [misGruposError, setMisGruposError] = useState("");

  async function loadMisGrupos() {
    setMisGruposLoading(true);
    setMisGruposError("");
    try {
      const data = await getMisGrupos();
      setMisGrupos(data);
    } catch (error) {
      setMisGruposError(error.message);
    } finally {
      setMisGruposLoading(false);
    }
  }

  useEffect(() => {
    loadMisGrupos();
  }, []);

  // ---------------- Crear grupo ----------------
  const [crearForm, setCrearForm] = useState({ name: "" });
  const [crearFieldErrors, setCrearFieldErrors] = useState({});
  const [crearError, setCrearError] = useState("");
  const [crearLoading, setCrearLoading] = useState(false);
  const [grupoCreado, setGrupoCreado] = useState(null);

  function handleCrearChange(event) {
    const { name, value } = event.target;
    setCrearForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCrearSubmit(event) {
    event.preventDefault();
    setCrearError("");
    setGrupoCreado(null);

    const errors = {};
    if (!crearForm.name.trim()) {
      errors.name = "El nombre del grupo es obligatorio";
    }
    setCrearFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setCrearLoading(true);
    try {
      const grupo = await createGrupo(crearForm.name.trim());
      setGrupoCreado(grupo);
      setCrearForm({ name: "" });
      loadMisGrupos();
    } catch (error) {
      setCrearError(error.message);
    } finally {
      setCrearLoading(false);
    }
  }

  // ---------------- Unirse a un grupo ----------------
  const [unirseForm, setUnirseForm] = useState({ codigo: "" });
  const [unirseFieldErrors, setUnirseFieldErrors] = useState({});
  const [unirseError, setUnirseError] = useState("");
  const [unirseLoading, setUnirseLoading] = useState(false);
  const [grupoUnido, setGrupoUnido] = useState(null);

  function handleUnirseChange(event) {
    const { name, value } = event.target;
    setUnirseForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleUnirseSubmit(event) {
    event.preventDefault();
    setUnirseError("");
    setGrupoUnido(null);

    const errors = {};
    if (!unirseForm.codigo.trim()) {
      errors.codigo = "El código es obligatorio";
    }
    setUnirseFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setUnirseLoading(true);
    try {
      const grupo = await joinGrupo(unirseForm.codigo.trim());
      setGrupoUnido(grupo);
      setUnirseForm({ codigo: "" });
      loadMisGrupos();
    } catch (error) {
      setUnirseError(error.message);
    } finally {
      setUnirseLoading(false);
    }
  }

  // ---------------- Ranking (por click en grupo) ----------------
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [rankingError, setRankingError] = useState("");

  async function handleSeleccionarGrupo(grupo) {
    if (selectedGrupo?.id === grupo.id) {
      setSelectedGrupo(null);
      setRanking(null);
      return;
    }
    setSelectedGrupo(grupo);
    setRankingError("");
    setRanking(null);
    setRankingLoading(true);
    try {
      const data = await getRankingGrupo(grupo.id);
      setRanking(data.map(mapLeaderboardEntryToUI));
    } catch (error) {
      setRankingError(error.message);
    } finally {
      setRankingLoading(false);
    }
  }

  const displayName = getDisplayName(token, stats?.username);

  return (
    <div className="dv-shell">
      <Sidebar
        displayName={displayName}
        initials={getInitials(displayName)}
        globalRank={stats?.globalRank}
      />

      <main className="dv-main">
        <h1 className="dv-greeting">
          Mis <span className="dv-greeting__accent">grupos</span>
        </h1>
        <p className="dv-sub">
          Creá una peña, invitá amigos con un código y seguí el ranking entre ustedes.
        </p>

        {/* Crear grupo — solo para usuarios */}
        {!isAdmin && (
          <div className="dv-card" style={{ marginBottom: "1rem" }}>
            <p className="dv-eyebrow">Crear grupo</p>

            <form onSubmit={handleCrearSubmit} noValidate>
              {crearError && <div className="form-error-banner">{crearError}</div>}
              {grupoCreado && (
                <div className="form-success-banner">
                  Grupo "{grupoCreado.name}" creado. Código de invitación:{" "}
                  <strong>{grupoCreado.codigoInvitacion}</strong>
                </div>
              )}

              <FormField
                id="crear-name"
                name="name"
                label="Nombre del grupo"
                type="text"
                placeholder="Ej: Los Pronosticadores"
                value={crearForm.name}
                onChange={handleCrearChange}
                error={crearFieldErrors.name}
              />

              <button type="submit" className="dv-btn-cyan dv-btn-cyan--inline" disabled={crearLoading}>
                {crearLoading ? "Guardando..." : "Crear grupo"}
              </button>
            </form>
          </div>
        )}

        {/* Unirse a un grupo — solo para usuarios */}
        {!isAdmin && (
          <div className="dv-card" style={{ marginBottom: "1rem" }}>
            <p className="dv-eyebrow">Unirme a un grupo</p>

            <form onSubmit={handleUnirseSubmit} noValidate>
              {unirseError && <div className="form-error-banner">{unirseError}</div>}
              {grupoUnido && (
                <div className="form-success-banner">
                  Te uniste a "{grupoUnido.name}". Miembros:{" "}
                  {grupoUnido.miembros.join(", ")}
                </div>
              )}

              <FormField
                id="unirse-codigo"
                name="codigo"
                label="Código de invitación"
                type="text"
                placeholder="Ej: AB12CD34"
                value={unirseForm.codigo}
                onChange={handleUnirseChange}
                error={unirseFieldErrors.codigo}
              />

              <button type="submit" className="dv-btn-cyan dv-btn-cyan--inline" disabled={unirseLoading}>
                {unirseLoading ? "Uniéndome..." : "Unirme"}
              </button>
            </form>
          </div>
        )}

        {/* Lista de grupos del usuario */}
        <div className="dv-card" style={{ marginBottom: "1rem" }}>
          <p className="dv-eyebrow">
            Mis grupos{misGrupos.length > 0 ? ` (${misGrupos.length})` : ""}
          </p>

          {misGruposLoading && <p className="dv-empty">Cargando...</p>}
          {misGruposError && <div className="form-error-banner">{misGruposError}</div>}
          {!misGruposLoading && misGrupos.length === 0 && (
            <p className="dv-empty">Todavía no pertenecés a ningún grupo.</p>
          )}

          {misGrupos.map((grupo) => (
            <div className="dv-pred-row" key={grupo.id}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{grupo.name}</div>
                <div className="dv-table__muted" style={{ fontSize: "0.73rem", marginTop: "0.15rem" }}>
                  {grupo.miembros.join(" · ")}
                </div>
              </div>
              <span
                className="dv-pred-badge dv-pred-badge--muted"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.5px" }}
              >
                {grupo.codigoInvitacion}
              </span>
              <button
                className="dv-pending-cta"
                onClick={() => handleSeleccionarGrupo(grupo)}
                disabled={rankingLoading && selectedGrupo?.id === grupo.id}
              >
                {rankingLoading && selectedGrupo?.id === grupo.id
                  ? "Cargando..."
                  : selectedGrupo?.id === grupo.id
                  ? "Cerrar"
                  : "Ver ranking"}
              </button>
            </div>
          ))}
        </div>

        {/* Ranking del grupo seleccionado */}
        {selectedGrupo && (
          <div className="dv-card">
            <p className="dv-eyebrow">Ranking — {selectedGrupo.name}</p>
            {rankingError && <div className="form-error-banner">{rankingError}</div>}
            {rankingLoading && <p className="dv-empty">Cargando ranking...</p>}
            {ranking && (
              <div className="dv-rail-list" style={{ marginTop: "1.25rem", maxHeight: "none" }}>
                {ranking.map((entry) => (
                  <LeaderboardItem key={entry.rank} entry={entry} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
