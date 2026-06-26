import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import ConfirmDialog from "../components/ConfirmDialog";
import FormField from "../components/FormField";
import TeamBadge from "../components/TeamBadge";
import { getDisplayName, getInitials } from "../utils/profile";
import { fetchDashboardStats } from "../api/dashboardService";
import { fetchTodosLosPartidos } from "../api/prediccionesService";
import { createEquipo, getEquipos, deleteEquipo } from "../api/equipoService";
import { createJornada, getJornadas, deleteJornada } from "../api/jornadaService";
import {
  createPartido,
  iniciarPartido,
  cargarResultado,
  deletePartido,
} from "../api/partidoService";

const ESTADO_LABEL = {
  PROGRAMADA: "Programada",
  EN_JUEGO: "En juego",
  FINALIZADA: "Finalizada",
  // fetchTodosLosPartidos ya devuelve el estado de partido mapeado
  // (ver mapPartidoToUI en dashboardService) a estos tres valores.
  UPCOMING: "Por jugarse",
  LIVE: "En juego",
  FINISHED: "Finalizado",
};

export default function AdminPage() {
  const { token } = useAuth();
  const location = useLocation();

  const [stats, setStats] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [jornadas, setJornadas] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [listsError, setListsError] = useState("");

  // ---------------- Toast (feedback de borrados) ----------------
  const [toast, setToast] = useState(null); // { type: "error"|"success", message }

  function showToast(type, message) {
    setToast({ type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 6000);
  }

  // ---------------- Diálogo de confirmación ----------------
  // { message, detail, confirmLabel, danger, onConfirm }
  const [confirmState, setConfirmState] = useState(null);

  function openConfirm({ message, detail, confirmLabel = "Confirmar", danger = false, onConfirm }) {
    setConfirmState({ message, detail, confirmLabel, danger, onConfirm });
  }

  function closeConfirm() {
    setConfirmState(null);
  }

  useEffect(() => {
    async function loadLists() {
      try {
        const [s, equiposData, jornadasData, grupos] = await Promise.all([
          fetchDashboardStats(),
          getEquipos(),
          getJornadas(),
          fetchTodosLosPartidos(),
        ]);
        setStats(s);
        setEquipos(equiposData);
        setJornadas(jornadasData);
        setPartidos(grupos.flatMap((g) => g.partidos.map((p) => ({ ...p, jornadaName: g.jornada.name }))));
      } catch (error) {
        setListsError(error.message);
      }
    }

    loadLists();
  }, []);

  // Si llegamos con un hash (ej. /admin#partidos) scrolleamos a esa sección.
  useEffect(() => {
    if (!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  // ---------------- Crear equipo ----------------
  const [equipoForm, setEquipoForm] = useState({ name: "", escudo: "" });
  const [equipoFieldErrors, setEquipoFieldErrors] = useState({});
  const [equipoFormError, setEquipoFormError] = useState("");
  const [equipoSuccess, setEquipoSuccess] = useState("");
  const [equipoLoading, setEquipoLoading] = useState(false);

  function handleEquipoChange(event) {
    const { name, value } = event.target;
    setEquipoForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateEquipo() {
    const errors = {};
    if (!equipoForm.name.trim()) {
      errors.name = "El nombre es obligatorio";
    }
    if (!equipoForm.escudo.trim()) {
      errors.escudo = "La URL del escudo es obligatoria";
    }
    return errors;
  }

  async function handleEquipoSubmit(event) {
    event.preventDefault();
    setEquipoFormError("");
    setEquipoSuccess("");

    const errors = validateEquipo();
    setEquipoFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setEquipoLoading(true);
    try {
      const nuevoEquipo = await createEquipo(
        equipoForm.name.trim(),
        equipoForm.escudo.trim()
      );
      setEquipos((prev) => [...prev, nuevoEquipo]);
      setEquipoSuccess(`Equipo "${nuevoEquipo.nombre}" creado correctamente.`);
      setEquipoForm({ name: "", escudo: "" });
    } catch (error) {
      setEquipoFormError(error.message);
    } finally {
      setEquipoLoading(false);
    }
  }

  // ---------------- Crear jornada ----------------
  const [jornadaForm, setJornadaForm] = useState({ name: "" });
  const [jornadaFieldErrors, setJornadaFieldErrors] = useState({});
  const [jornadaFormError, setJornadaFormError] = useState("");
  const [jornadaSuccess, setJornadaSuccess] = useState("");
  const [jornadaLoading, setJornadaLoading] = useState(false);

  function handleJornadaChange(event) {
    const { name, value } = event.target;
    setJornadaForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateJornada() {
    const errors = {};
    if (!jornadaForm.name.trim()) {
      errors.name = "El nombre es obligatorio";
    }
    return errors;
  }

  async function handleJornadaSubmit(event) {
    event.preventDefault();
    setJornadaFormError("");
    setJornadaSuccess("");

    const errors = validateJornada();
    setJornadaFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setJornadaLoading(true);
    try {
      const nuevaJornada = await createJornada(jornadaForm.name.trim());
      setJornadas((prev) => [...prev, nuevaJornada]);
      setJornadaSuccess(`Jornada "${nuevaJornada.name}" creada correctamente.`);
      setJornadaForm({ name: "" });
    } catch (error) {
      setJornadaFormError(error.message);
    } finally {
      setJornadaLoading(false);
    }
  }

  // ---------------- Crear partido ----------------
  const [partidoForm, setPartidoForm] = useState({
    jornadaId: "",
    equipoLocalId: "",
    equipoVisitanteId: "",
    dateTime: "",
  });
  const [partidoFieldErrors, setPartidoFieldErrors] = useState({});
  const [partidoFormError, setPartidoFormError] = useState("");
  const [partidoSuccess, setPartidoSuccess] = useState("");
  const [partidoLoading, setPartidoLoading] = useState(false);

  // ---------------- Ciclo de vida de un partido (iniciar / finalizar) ----------------
  // resultadoForms: { [partidoId]: { golesLocal, golesVisitante } } — un form
  // por cada fila "En juego" de la tabla.
  const [resultadoForms, setResultadoForms] = useState({});
  const [lifecycleErrors, setLifecycleErrors] = useState({});
  const [lifecycleLoadingId, setLifecycleLoadingId] = useState(null);

  function handleResultadoFieldChange(partidoId, field, value) {
    setResultadoForms((prev) => ({
      ...prev,
      [partidoId]: { ...prev[partidoId], [field]: value },
    }));
  }

  function handleIniciarPartido(partidoId) {
    openConfirm({
      message: "¿Seguro que querés iniciar este partido?",
      detail: "Esta acción no se puede revertir.",
      confirmLabel: "Iniciar partido",
      danger: false,
      onConfirm: async () => {
        setLifecycleErrors((prev) => ({ ...prev, [partidoId]: "" }));
        setLifecycleLoadingId(partidoId);
        try {
          await iniciarPartido(partidoId);
          setPartidos((prev) =>
            prev.map((p) => (p.id === partidoId ? { ...p, status: "LIVE" } : p))
          );
        } catch (error) {
          setLifecycleErrors((prev) => ({ ...prev, [partidoId]: error.message }));
        } finally {
          setLifecycleLoadingId(null);
        }
      },
    });
  }

  function handleFinalizarPartido(partidoId) {
    const form = resultadoForms[partidoId] ?? {};
    if (form.golesLocal === undefined || form.golesLocal === "" ||
        form.golesVisitante === undefined || form.golesVisitante === "") {
      setLifecycleErrors((prev) => ({
        ...prev,
        [partidoId]: "Completá los dos resultados",
      }));
      return;
    }

    const partido = partidos.find((p) => p.id === partidoId);
    const matchLabel = partido
      ? `${partido.homeTeam.name} vs ${partido.awayTeam.name}`
      : "este partido";

    openConfirm({
      message: `¿Confirmás el resultado ${form.golesLocal} - ${form.golesVisitante}?`,
      detail: `${matchLabel} — Se calcularán los puntos para todos los usuarios y no se puede revertir.`,
      confirmLabel: "Finalizar partido",
      danger: false,
      onConfirm: async () => {
        setLifecycleErrors((prev) => ({ ...prev, [partidoId]: "" }));
        setLifecycleLoadingId(partidoId);
        try {
          const actualizado = await cargarResultado(
            partidoId,
            Number(form.golesLocal),
            Number(form.golesVisitante)
          );
          setPartidos((prev) =>
            prev.map((p) =>
              p.id === partidoId
                ? {
                    ...p,
                    status: "FINISHED",
                    actualHome: actualizado.golesLocal,
                    actualAway: actualizado.golesVisitante,
                  }
                : p
            )
          );
          setResultadoForms((prev) => {
            const next = { ...prev };
            delete next[partidoId];
            return next;
          });
        } catch (error) {
          setLifecycleErrors((prev) => ({ ...prev, [partidoId]: error.message }));
        } finally {
          setLifecycleLoadingId(null);
        }
      },
    });
  }

  function handlePartidoChange(event) {
    const { name, value } = event.target;
    setPartidoForm((prev) => ({ ...prev, [name]: value }));
  }

  function validatePartido() {
    const errors = {};
    if (!partidoForm.jornadaId) {
      errors.jornadaId = "La jornada es obligatoria";
    }
    if (!partidoForm.equipoLocalId) {
      errors.equipoLocalId = "El equipo local es obligatorio";
    }
    if (!partidoForm.equipoVisitanteId) {
      errors.equipoVisitanteId = "El equipo visitante es obligatorio";
    }
    if (
      partidoForm.equipoLocalId &&
      partidoForm.equipoVisitanteId &&
      partidoForm.equipoLocalId === partidoForm.equipoVisitanteId
    ) {
      errors.equipoVisitanteId = "El equipo visitante debe ser distinto al local";
    }
    if (!partidoForm.dateTime) {
      errors.dateTime = "La fecha y hora son obligatorias";
    }
    return errors;
  }

  async function handlePartidoSubmit(event) {
    event.preventDefault();
    setPartidoFormError("");
    setPartidoSuccess("");

    const errors = validatePartido();
    setPartidoFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setPartidoLoading(true);
    try {
      const nuevoPartido = await createPartido({
        jornadaId: Number(partidoForm.jornadaId),
        equipoLocalId: Number(partidoForm.equipoLocalId),
        equipoVisitanteId: Number(partidoForm.equipoVisitanteId),
        dateTime: partidoForm.dateTime,
      });
      const jornadaName =
        jornadas.find((j) => j.id === Number(partidoForm.jornadaId))?.name ?? "";
      setPartidos((prev) => [
        ...prev,
        {
          id: nuevoPartido.id,
          homeTeam: {
            name: nuevoPartido.equipoLocal.nombre,
            escudo: nuevoPartido.equipoLocal.escudo,
          },
          awayTeam: {
            name: nuevoPartido.equipoVisitante.nombre,
            escudo: nuevoPartido.equipoVisitante.escudo,
          },
          date: nuevoPartido.fechaInicio,
          // Un partido recién creado siempre nace "Por jugarse" (POR_JUGARSE
          // -> UPCOMING), mismo mapeo que usa fetchTodosLosPartidos.
          status: "UPCOMING",
          jornadaName,
        },
      ]);
      setPartidoSuccess("Partido creado correctamente.");
      setPartidoForm({
        jornadaId: "",
        equipoLocalId: "",
        equipoVisitanteId: "",
        dateTime: "",
      });
    } catch (error) {
      setPartidoFormError(error.message);
    } finally {
      setPartidoLoading(false);
    }
  }

  // ---------------- Borrado de filas (equipo / jornada / partido) ----------------
  // Confirmación simple (nativa del browser) porque es una acción irreversible.
  // Si el backend rechaza el borrado por una regla de integridad, mostramos el
  // mensaje REAL que devuelve (error.message ya viene de ahí, vía apiClient).

  function handleDeleteEquipo(equipo) {
    openConfirm({
      message: `¿Seguro que querés eliminar el equipo "${equipo.nombre}"?`,
      confirmLabel: "Eliminar",
      danger: true,
      onConfirm: async () => {
        try {
          await deleteEquipo(equipo.id);
          setEquipos((prev) => prev.filter((e) => e.id !== equipo.id));
          showToast("success", `Equipo "${equipo.nombre}" eliminado.`);
        } catch (error) {
          showToast("error", error.message);
        }
      },
    });
  }

  function handleDeleteJornada(jornada) {
    openConfirm({
      message: `¿Seguro que querés eliminar la jornada "${jornada.name}"?`,
      confirmLabel: "Eliminar",
      danger: true,
      onConfirm: async () => {
        try {
          await deleteJornada(jornada.id);
          setJornadas((prev) => prev.filter((j) => j.id !== jornada.id));
          showToast("success", `Jornada "${jornada.name}" eliminada.`);
        } catch (error) {
          showToast("error", error.message);
        }
      },
    });
  }

  function handleDeletePartido(partido) {
    const nombre = `${partido.homeTeam.name} vs ${partido.awayTeam.name}`;
    openConfirm({
      message: `¿Seguro que querés eliminar el partido "${nombre}"?`,
      confirmLabel: "Eliminar",
      danger: true,
      onConfirm: async () => {
        try {
          await deletePartido(partido.id);
          setPartidos((prev) => prev.filter((p) => p.id !== partido.id));
          showToast("success", `Partido "${nombre}" eliminado.`);
        } catch (error) {
          showToast("error", error.message);
        }
      },
    });
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
          Panel de <span className="dv-greeting__accent">administración</span>
        </h1>
        <p className="dv-sub">Gestioná equipos, jornadas y partidos para los pronósticos.</p>

        {listsError && <div className="form-error-banner">{listsError}</div>}

        <section id="equipos" className="dv-card" style={{ marginBottom: "1rem" }}>
          <p className="dv-eyebrow">Crear equipo</p>

          <form onSubmit={handleEquipoSubmit} noValidate>
            {equipoFormError && <div className="form-error-banner">{equipoFormError}</div>}
            {equipoSuccess && <div className="form-success-banner">{equipoSuccess}</div>}

            <FormField
              id="equipo-name"
              name="name"
              label="Nombre"
              type="text"
              placeholder="Ej: River Plate"
              value={equipoForm.name}
              onChange={handleEquipoChange}
              error={equipoFieldErrors.name}
            />

            <FormField
              id="escudo"
              label="Escudo (URL de imagen)"
              type="text"
              placeholder="https://..."
              value={equipoForm.escudo}
              onChange={handleEquipoChange}
              error={equipoFieldErrors.escudo}
            />

            <button type="submit" className="dv-btn-cyan dv-btn-cyan--inline" disabled={equipoLoading}>
              {equipoLoading ? "Guardando..." : "Crear equipo"}
            </button>
          </form>

          <div className="dv-divider" />
          <p className="dv-eyebrow">Equipos existentes ({equipos.length})</p>
          {equipos.length > 0 ? (
            <div className="dv-table-wrap">
              <table className="dv-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Escudo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {equipos.map((equipo) => (
                    <tr key={equipo.id}>
                      <td className="dv-table__muted">{equipo.id}</td>
                      <td>
                        <TeamBadge name={equipo.nombre} escudo={equipo.escudo} size={22} />
                      </td>
                      <td className="dv-table__muted">{equipo.escudo}</td>
                      <td>
                        <button
                          className="dv-btn-danger--small"
                          onClick={() => handleDeleteEquipo(equipo)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="dv-empty">Todavía no hay equipos creados.</p>
          )}
        </section>

        <section id="jornadas" className="dv-card" style={{ marginBottom: "1rem" }}>
          <p className="dv-eyebrow">Crear jornada</p>

          <form onSubmit={handleJornadaSubmit} noValidate>
            {jornadaFormError && <div className="form-error-banner">{jornadaFormError}</div>}
            {jornadaSuccess && <div className="form-success-banner">{jornadaSuccess}</div>}

            <FormField
              id="jornada-name"
              name="name"
              label="Nombre"
              type="text"
              placeholder="Ej: Fecha 1"
              value={jornadaForm.name}
              onChange={handleJornadaChange}
              error={jornadaFieldErrors.name}
            />

            <button type="submit" className="dv-btn-cyan dv-btn-cyan--inline" disabled={jornadaLoading}>
              {jornadaLoading ? "Guardando..." : "Crear jornada"}
            </button>
          </form>

          <div className="dv-divider" />
          <p className="dv-eyebrow">Jornadas existentes ({jornadas.length})</p>
          {jornadas.length > 0 ? (
            <div className="dv-table-wrap">
              <table className="dv-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {jornadas.map((jornada) => (
                    <tr key={jornada.id}>
                      <td className="dv-table__muted">{jornada.id}</td>
                      <td>{jornada.name}</td>
                      <td>{ESTADO_LABEL[jornada.estado] ?? jornada.estado}</td>
                      <td>
                        <button
                          className="dv-btn-danger--small"
                          onClick={() => handleDeleteJornada(jornada)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="dv-empty">Todavía no hay jornadas creadas.</p>
          )}
        </section>

        <section id="partidos" className="dv-card" style={{ marginBottom: "1rem" }}>
          <p className="dv-eyebrow">Crear partido</p>

          <form onSubmit={handlePartidoSubmit} noValidate>
            {partidoFormError && <div className="form-error-banner">{partidoFormError}</div>}
            {partidoSuccess && <div className="form-success-banner">{partidoSuccess}</div>}

            <div className="dv-field">
              <label htmlFor="jornadaId" className="dv-field__label">
                Jornada
              </label>
              <select
                id="jornadaId"
                name="jornadaId"
                className={`dv-field__input ${
                  partidoFieldErrors.jornadaId ? "dv-field__input--error" : ""
                }`}
                value={partidoForm.jornadaId}
                onChange={handlePartidoChange}
              >
                <option value="">Seleccioná una jornada</option>
                {jornadas.map((jornada) => (
                  <option key={jornada.id} value={jornada.id}>
                    {jornada.name}
                  </option>
                ))}
              </select>
              {partidoFieldErrors.jornadaId && (
                <p className="dv-field__error">{partidoFieldErrors.jornadaId}</p>
              )}
            </div>

            <div className="dv-field">
              <label htmlFor="equipoLocalId" className="dv-field__label">
                Equipo local
              </label>
              <select
                id="equipoLocalId"
                name="equipoLocalId"
                className={`dv-field__input ${
                  partidoFieldErrors.equipoLocalId ? "dv-field__input--error" : ""
                }`}
                value={partidoForm.equipoLocalId}
                onChange={handlePartidoChange}
              >
                <option value="">Seleccioná un equipo</option>
                {equipos.map((equipo) => (
                  <option key={equipo.id} value={equipo.id}>
                    {equipo.nombre}
                  </option>
                ))}
              </select>
              {partidoFieldErrors.equipoLocalId && (
                <p className="dv-field__error">{partidoFieldErrors.equipoLocalId}</p>
              )}
            </div>

            <div className="dv-field">
              <label htmlFor="equipoVisitanteId" className="dv-field__label">
                Equipo visitante
              </label>
              <select
                id="equipoVisitanteId"
                name="equipoVisitanteId"
                className={`dv-field__input ${
                  partidoFieldErrors.equipoVisitanteId ? "dv-field__input--error" : ""
                }`}
                value={partidoForm.equipoVisitanteId}
                onChange={handlePartidoChange}
              >
                <option value="">Seleccioná un equipo</option>
                {equipos.map((equipo) => (
                  <option key={equipo.id} value={equipo.id}>
                    {equipo.nombre}
                  </option>
                ))}
              </select>
              {partidoFieldErrors.equipoVisitanteId && (
                <p className="dv-field__error">{partidoFieldErrors.equipoVisitanteId}</p>
              )}
            </div>

            <FormField
              id="dateTime"
              label="Fecha y hora"
              type="datetime-local"
              value={partidoForm.dateTime}
              onChange={handlePartidoChange}
              error={partidoFieldErrors.dateTime}
            />

            <button type="submit" className="dv-btn-cyan dv-btn-cyan--inline" disabled={partidoLoading}>
              {partidoLoading ? "Guardando..." : "Crear partido"}
            </button>
          </form>

          <div className="dv-divider" />
          <p className="dv-eyebrow">Partidos existentes ({partidos.length})</p>
          {partidos.length > 0 ? (
            <div className="dv-table-wrap">
              <table className="dv-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Jornada</th>
                    <th>Partido</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Resultado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {partidos.map((partido) => {
                    const form = resultadoForms[partido.id] ?? {};
                    const rowLoading = lifecycleLoadingId === partido.id;
                    const rowError = lifecycleErrors[partido.id];
                    return (
                      <tr key={partido.id}>
                        <td className="dv-table__muted">{partido.id}</td>
                        <td className="dv-table__muted">{partido.jornadaName}</td>
                        <td>
                          <TeamBadge {...partido.homeTeam} size={18} /> vs{" "}
                          <TeamBadge {...partido.awayTeam} size={18} />
                        </td>
                        <td className="dv-table__muted">
                          {new Date(partido.date).toLocaleString("es-AR")}
                        </td>
                        <td>{ESTADO_LABEL[partido.status] ?? partido.status}</td>
                        <td className="dv-table__muted">
                          {partido.status === "FINISHED"
                            ? `${partido.actualHome} - ${partido.actualAway}`
                            : "—"}
                        </td>
                        <td>
                          {partido.status === "UPCOMING" && (
                            <div className="dv-row-actions">
                              <button
                                className="dv-btn-cyan dv-btn-cyan--inline dv-btn-cyan--small"
                                disabled={rowLoading}
                                onClick={() => handleIniciarPartido(partido.id)}
                              >
                                {rowLoading ? "Iniciando..." : "Iniciar partido"}
                              </button>
                              <button
                                className="dv-btn-danger--small"
                                onClick={() => handleDeletePartido(partido)}
                              >
                                Eliminar
                              </button>
                            </div>
                          )}

                          {partido.status === "LIVE" && (
                            <div className="dv-row-resultado">
                              <div className="dv-row-resultado__inputs">
                                <label className="dv-row-resultado__field">
                                  <span className="dv-row-resultado__field-label">Local</span>
                                  <input
                                    type="number"
                                    min="0"
                                    className="dv-row-resultado__input"
                                    placeholder="0"
                                    value={form.golesLocal ?? ""}
                                    onChange={(e) =>
                                      handleResultadoFieldChange(partido.id, "golesLocal", e.target.value)
                                    }
                                  />
                                </label>
                                <span className="dv-row-resultado__sep">—</span>
                                <label className="dv-row-resultado__field">
                                  <span className="dv-row-resultado__field-label">Visitante</span>
                                  <input
                                    type="number"
                                    min="0"
                                    className="dv-row-resultado__input"
                                    placeholder="0"
                                    value={form.golesVisitante ?? ""}
                                    onChange={(e) =>
                                      handleResultadoFieldChange(partido.id, "golesVisitante", e.target.value)
                                    }
                                  />
                                </label>
                              </div>
                              <div className="dv-row-resultado__btns">
                                <button
                                  className="dv-btn-cyan dv-btn-cyan--inline dv-btn-cyan--small"
                                  disabled={rowLoading}
                                  onClick={() => handleFinalizarPartido(partido.id)}
                                >
                                  {rowLoading ? "Guardando..." : "Finalizar"}
                                </button>
                                <button
                                  className="dv-btn-danger--small"
                                  onClick={() => handleDeletePartido(partido)}
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          )}

                          {partido.status === "FINISHED" && (
                            <div className="dv-row-actions">
                              <span className="dv-table__muted">Sin acciones</span>
                              <button
                                className="dv-btn-danger--small"
                                onClick={() => handleDeletePartido(partido)}
                              >
                                Eliminar
                              </button>
                            </div>
                          )}

                          {rowError && <p className="dv-field__error">{rowError}</p>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="dv-empty">Todavía no hay partidos creados.</p>
          )}
        </section>
      </main>

      {confirmState && (
        <ConfirmDialog
          message={confirmState.message}
          detail={confirmState.detail}
          confirmLabel={confirmState.confirmLabel}
          danger={confirmState.danger}
          onConfirm={() => {
            const fn = confirmState.onConfirm;
            closeConfirm();
            fn();
          }}
          onCancel={closeConfirm}
        />
      )}

      {toast && (
        <div className={`dv-toast dv-toast--${toast.type}`}>
          <span className="dv-toast__message">{toast.message}</span>
          <button className="dv-toast__close" onClick={() => setToast(null)}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
