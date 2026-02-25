export default function DataTable({ columns, data }) {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          {columns.map(c => (
            <th key={c} className="p-2 border">{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map(c => (
              <td key={c} className="p-2 border">
                {row[c]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
