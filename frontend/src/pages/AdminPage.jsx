import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import FormField from "../components/FormField";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { createEquipo } from "../api/equipoService";

export default function AdminPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: "", escudo: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const errors = {};

    if (!form.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
    }

    if (!form.escudo.trim()) {
      errors.escudo = "La URL del escudo es obligatoria";
    }

    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await createEquipo(form.nombre.trim(), form.escudo.trim());
      setSuccessMessage(`Equipo "${form.nombre.trim()}" creado correctamente.`);
      setForm({ nombre: "", escudo: "" });
    } catch (error) {
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <img src={logo} alt="Predigol" className="dashboard-header__logo" />
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Button variant="ghost" onClick={() => navigate("/")}>
            Ir al dashboard
          </Button>
          <button className="dashboard-header__logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="dashboard-body">
        <main className="dashboard-main">
          <section>
            <h1 className="dash-greeting__name">
              Panel de <span className="dash-greeting__accent">administración</span>
            </h1>
            <p className="dash-greeting__sub">
              Gestioná los equipos disponibles para los pronósticos.
            </p>
          </section>

          <div className="dash-card">
            <p className="dash-card__title">Crear equipo</p>

            <form onSubmit={handleSubmit} noValidate>
              {formError && <div className="form-error-banner">{formError}</div>}
              {successMessage && (
                <div className="form-success-banner">{successMessage}</div>
              )}

              <FormField
                id="nombre"
                label="Nombre"
                type="text"
                placeholder="Ej: River Plate"
                value={form.nombre}
                onChange={handleChange}
                error={fieldErrors.nombre}
              />

              <FormField
                id="escudo"
                label="Escudo (URL de imagen)"
                type="text"
                placeholder="https://..."
                value={form.escudo}
                onChange={handleChange}
                error={fieldErrors.escudo}
              />

              <Button type="submit" loading={loading}>
                Crear equipo
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
