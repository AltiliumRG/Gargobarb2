export default function ThemeSelector({ theme, setTheme }) {
  return (
    <div>
      <label className="font-semibold block mb-1">Tema</label>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="dark">Oscuro</option>
        <option value="light">Claro</option>
      </select>
    </div>
  );
}
