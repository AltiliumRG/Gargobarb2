export default function ColorPicker({ label, value, onChange }) {
  return (
    <div>
      <label className="block font-semibold mb-1">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-16 h-10 cursor-pointer"
      />
    </div>
  );
}
