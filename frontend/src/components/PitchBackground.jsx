// ============================================================
// PitchBackground.jsx
// ============================================================
// Elemento decorativo / de marca: dibuja, con SVG, las líneas de
// una cancha de fútbol vista "táctica" (línea media, círculo
// central, arcos de córner) con un degradé cian -> lavanda,
// como si fuera un diagrama de pizarra táctica iluminado.
//
// Es puramente decorativo (no tiene texto ni info importante),
// por eso lleva aria-hidden="true": los lectores de pantalla lo
// van a ignorar.
//
// Se usa como fondo del panel izquierdo en <AuthLayout />.
// Si quieren ajustar el "brillo" del dibujo, jueguen con los
// valores de stop-opacity de los <linearGradient> de abajo.
// ============================================================
export default function PitchBackground() {
  return (
    <svg
      className="pitch-bg"
      viewBox="0 0 600 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* Degradé principal: de cian a lavanda */}
        <linearGradient id="pitchLine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#35e0c9" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.35" />
        </linearGradient>

        {/* Degradé suave para el círculo central (más sutil) */}
        <linearGradient id="pitchLineSoft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#35e0c9" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Línea media de la cancha (horizontal) */}
      <line x1="0" y1="400" x2="600" y2="400" stroke="url(#pitchLine)" strokeWidth="2" />

      {/* Círculo central */}
      <circle cx="300" cy="400" r="120" stroke="url(#pitchLineSoft)" strokeWidth="2" fill="none" />
      <circle cx="300" cy="400" r="4" fill="#35e0c9" fillOpacity="0.6" />

      {/* Arco de córner: esquina superior izquierda */}
      <path d="M 0 60 A 60 60 0 0 1 60 0" stroke="url(#pitchLine)" strokeWidth="2" fill="none" />
      {/* Arco de córner: esquina superior derecha */}
      <path d="M 540 0 A 60 60 0 0 1 600 60" stroke="url(#pitchLine)" strokeWidth="2" fill="none" />
      {/* Arco de córner: esquina inferior izquierda */}
      <path d="M 0 740 A 60 60 0 0 0 60 800" stroke="url(#pitchLine)" strokeWidth="2" fill="none" />
      {/* Arco de córner: esquina inferior derecha */}
      <path d="M 540 800 A 60 60 0 0 0 600 740" stroke="url(#pitchLine)" strokeWidth="2" fill="none" />

      {/* Marco general de la cancha, separado del borde real del panel */}
      <rect
        x="24"
        y="24"
        width="552"
        height="752"
        rx="4"
        stroke="url(#pitchLineSoft)"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
