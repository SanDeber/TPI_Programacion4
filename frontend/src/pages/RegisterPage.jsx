import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

// ============================================================
// RegisterPage.jsx
// ============================================================
// Pantalla de registro. Misma lógica que LoginPage, pero con un
// campo más (nombre) y reglas de validación que reflejan las del
// backend (ver RegisterUserRequest.java):
//   - name: solo letras y espacios (incluye acentos y ñ)
//   - email: formato válido
//   - password: entre 8 y 50 caracteres
//
// Si el registro es exitoso, el backend devuelve un token (queda
// logueado automáticamente) y lo mandamos directo a la home.
// ============================================================

// Mismo patrón que usa el backend en RegisterUserRequest
// (letras, con acentos/ñ, y espacios)
const NAME_PATTERN = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = "El nombre es obligatorio";
    } else if (!NAME_PATTERN.test(form.name)) {
      errors.name = "El nombre solo puede contener letras y espacios";
    }

    if (!form.email.trim()) {
      errors.email = "El email no puede estar vacío";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = "El email debe tener el formato usuario@dominio";
    }

    if (!form.password) {
      errors.password = "Debés completar la contraseña";
    } else if (form.password.length < 8 || form.password.length > 50) {
      errors.password = "La contraseña debe tener entre 8 y 50 caracteres";
    }

    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      // El registro deja al usuario logueado (el backend devuelve token),
      // así que lo mandamos directo a la home.
      navigate("/", { replace: true });
    } catch (error) {
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Creá tu cuenta"
      subtitle="Registrate gratis y empezá a competir con tus amigos."
    >
      <form onSubmit={handleSubmit} noValidate>
        {formError && <div className="form-error-banner">{formError}</div>}

        <FormField
          id="name"
          label="Nombre"
          type="text"
          placeholder="Tu nombre"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          error={fieldErrors.name}
        />

        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
        />

        <FormField
          id="password"
          label="Contraseña"
          type="password"
          placeholder="Entre 8 y 50 caracteres"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
        />

        <Button type="submit" loading={loading}>
          Crear cuenta
        </Button>
      </form>

      <p className="auth-card__footer">
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </AuthLayout>
  );
}
