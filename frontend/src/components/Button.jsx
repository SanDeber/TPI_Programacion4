// ============================================================
// Button.jsx
// ============================================================
// Botón reutilizable para los formularios de auth.
//
// Props:
//   - children: texto del botón (ej. "Ingresar")
//   - loading: si es true, muestra un spinner y deshabilita el botón
//     (para que el usuario no haga doble click mientras esperamos
//     la respuesta del backend)
//   - variant: "primary" (cian, relleno) | "ghost" (transparente, solo borde)
//   - ...rest: cualquier otra prop de <button> (type, onClick, disabled, etc.)
// ============================================================
export default function Button({ children, loading = false, variant = "primary", ...rest }) {
  return (
    <button
      className={`btn btn--${variant}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? <span className="btn__spinner" aria-hidden="true" /> : null}
      <span>{loading ? "Cargando..." : children}</span>
    </button>
  );
}
