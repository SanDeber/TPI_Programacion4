// ============================================================
// LeaderboardItem.jsx
// ============================================================
// Extraído de DashboardPage para poder reusarlo también en
// GruposPage (ranking por grupo) sin duplicar el markup.
// Espera entry = { rank, name, points }.
// ============================================================
const RANK_CLASS = ["", "gold", "silver", "bronze"];

export default function LeaderboardItem({ entry, highlight = false }) {
  const rankCls = RANK_CLASS[entry.rank] ?? "";
  return (
    <div className={`leaderboard-item${highlight ? " leaderboard-item--me" : ""}`}>

      <span
        className={`leaderboard-item__rank${
          rankCls ? ` leaderboard-item__rank--${rankCls}` : ""
        }`}
      >
        #{entry.rank}
      </span>
      <span className="leaderboard-item__name">{entry.name}</span>
      <span className="leaderboard-item__points">{entry.points}</span>
    </div>
  );
}
