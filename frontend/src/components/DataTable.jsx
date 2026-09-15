export default function DataTable({ columns, rows, emptyLabel = "No data yet." }) {
  if (!rows || rows.length === 0) {
    return <p className="dp-empty">{emptyLabel}</p>;
  }
  return (
    <div className="dp-table-wrap">
      <table className="dp-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id || row._id || i}>
              {columns.map((c) => (
                <td key={c.key}>{c.render ? c.render(row) : row[c.key] ?? "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SeverityBadge({ level }) {
  const l = (level || "low").toLowerCase();
  return <span className={`dp-badge dp-badge-${l}`}>{l}</span>;
}
