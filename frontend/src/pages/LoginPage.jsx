import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

// ============================================================
// LoginPage.jsx
// ============================================================
// Pantalla de inicio de sesión. Pasos:
//   1. El usuario completa email + contraseña.
//   2. Validamos en el FRONT los formatos básicos (esto es solo
//      para dar feedback rápido; la validación "de verdad" la
//      hace el backend).
//   3. Si pasa la validación, llamamos a login() del AuthContext,
//      que hace POST /api/auth/login.
//   4. Si todo OK -> redirigimos a la home ("/").
//   5. Si falla -> mostramos el mensaje de error que vino del
//      backend (o uno genérico si fue un error de red).
// ============================================================
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Estado de los campos del formulario
  const [form, setForm] = useState({ email: "", password: "" });
  // Errores por campo (se muestran debajo de cada input)
  const [fieldErrors, setFieldErrors] = useState({});
  // Error general del formulario (ej: "credenciales inválidas")
  const [formError, setFormError] = useState("");
  // Estado de carga mientras esperamos la respuesta del backend
  const [loading, setLoading] = useState(false);

  // Actualiza el campo correspondiente del estado "form"
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Validaciones básicas en el front. Devuelve un objeto
  // { campo: "mensaje" } solo con los campos que tienen error.
  function validate() {
    const errors = {};

    if (!form.email.trim()) {
      errors.email = "El email es obligatorio";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = "El email debe tener el formato usuario@dominio";
    }

    if (!form.password) {
      errors.password = "Debés completar la contraseña";
    } else if (form.password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return; // hay errores de formato, no llamamos al backend todavía
    }

    setLoading(true);
    try {
      await login(form.email, form.password);

      // Si el usuario venía de una página protegida (ej. quiso entrar
      // a "/perfil" sin estar logueado), lo volvemos a mandar ahí.
      // Si no, lo mandamos a la home.
      const redirectTo = location.state?.from ?? "/";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      // error.message viene de apiClient (mensaje legible del backend)
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Ingresá a tu cuenta"
      subtitle="Cargá tus pronósticos y seguí tu posición en el ranking."
    >
      <form onSubmit={handleSubmit} noValidate>
        {formError && <div className="form-error-banner">{formError}</div>}

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
          placeholder="••••••••"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
        />

        <Button type="submit" loading={loading}>
          Ingresar
        </Button>
      </form>

      <p className="auth-card__footer">
        ¿No tenés cuenta? <Link to="/registro">Creá una acá</Link>
      </p>
    </AuthLayout>
  );
}
