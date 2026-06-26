import { useState } from "react";

// ============================================================
// TeamBadge.jsx
// ============================================================
// Escudo chico de un equipo, con fallback a un círculo con la
// inicial del nombre si no hay URL, la URL está rota, o la imagen
// no carga. Usado en el listado de equipos del Admin y en
// cualquier lugar donde se muestre un equipo dentro de un partido
// (Dashboard, Mis pronósticos).
// ============================================================
export default function TeamBadge({ name, escudo, size = 20, showName = true }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(escudo) && !failed;

  return (
    <span className="team-badge">
      {showImage ? (
        <img
          src={escudo}
          alt=""
          className="team-badge__img"
          style={{ width: size, height: size }}
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          className="team-badge__placeholder"
          style={{ width: size, height: size, fontSize: size * 0.5 }}
        >
          {name?.trim()?.[0]?.toUpperCase() ?? "?"}
        </span>
      )}
      {showName && <span className="team-badge__name">{name}</span>}
    </span>
  );
}
