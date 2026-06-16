import PitchBackground from "./PitchBackground";
import logo from "../assets/logo.png";

// ============================================================
// AuthLayout.jsx
// ============================================================
// Layout compartido entre las pantallas de Login y Registro.
// Divide la pantalla en dos paneles:
//
//   - Panel izquierdo (".auth-hero"): el logo de Predigol, una
//     frase de marca y el dibujo de cancha (PitchBackground) de
//     fondo. Es el mismo en login y registro, así que vive en un
//     solo lugar.
//
//   - Panel derecho (".auth-form-panel"): acá se renderiza el
//     contenido específico de cada pantalla (el formulario),
//     recibido como "children".
//
// En mobile, el CSS (ver auth.css) apila los paneles en vertical
// y reduce el panel izquierdo a un encabezado chico.
//
// Props:
//   - title: título grande arriba del formulario (ej. "Ingresá a tu cuenta")
//   - subtitle: texto chico debajo del título
//   - children: el formulario en sí
// ============================================================
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <aside className="auth-hero">
        <PitchBackground />

        <div className="auth-hero__content">
          <img src={logo} alt="Predigol" className="auth-hero__logo" />
          <p className="auth-hero__tagline">
            Armá tu pronóstico. <span className="accent">Sumá puntos.</span> Subí en
            el ranking.
          </p>
        </div>
      </aside>

      <main className="auth-form-panel">
        <div className="auth-card">
          <h1 className="auth-card__title">{title}</h1>
          {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
          {children}
        </div>
      </main>
    </div>
  );
}
