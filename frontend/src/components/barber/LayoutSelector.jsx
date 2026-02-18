export default function LayoutSelector({ layout, setLayout }) {
  return (
    <div>
      <label className="font-semibold block mb-1">Diseño</label>
      <select
        value={layout}
        onChange={(e) => setLayout(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="classic">Clásico</option>
        <option value="modern">Moderno</option>
        <option value="minimal">Minimal</option>
      </select>
    </div>
  );
}
