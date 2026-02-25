const fonts = ["Roboto", "Montserrat", "Poppins", "Oswald"];

export default function FontSelector({ value, onChange }) {
  return (
    <div>
      <label className="font-semibold block mb-1">Fuente</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-2 rounded"
      >
        {fonts.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>
    </div>
  );
}
