// ============================================================
// FormField.jsx
// ============================================================
// Input reutilizable con su label y, si corresponde, un mensaje
// de error debajo (en rojo). Se usa tanto en Login como en
// Register para no repetir el markup de cada campo.
//
// Props:
//   - id: id/name del input (también se usa para el htmlFor del label)
//   - label: texto del label
//   - error: string con el error de ese campo (si no hay, no se muestra nada)
//   - ...rest: cualquier otra prop válida de <input> (type, value,
//     onChange, placeholder, autoComplete, etc.)
// ============================================================
export default function FormField({ id, label, error, ...rest }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
      </label>
      <input
        id={id}
        name={id}
        className={`form-field__input ${error ? "form-field__input--error" : ""}`}
        // aria-invalid + aria-describedby: para que lectores de pantalla
        // anuncien el error asociado a este campo puntual.
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="form-field__error">
          {error}
        </p>
      )}
    </div>
  );
}
