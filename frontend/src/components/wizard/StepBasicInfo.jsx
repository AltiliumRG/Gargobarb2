import { useWizard } from "../../context/WizardContext";

export default function StepBasicInfo() {
  const { data, updateData } = useWizard();

  return (
    <div className="space-y-4">
      <input
        className="w-full p-3 rounded bg-gray-800"
        placeholder="Nombre de la barbería"
        value={data.name}
        onChange={(e) => updateData({ name: e.target.value })}
      />

      <input
        className="w-full p-3 rounded bg-gray-800"
        placeholder="Dirección"
        value={data.address}
        onChange={(e) => updateData({ address: e.target.value })}
      />

      <input
        className="w-full p-3 rounded bg-gray-800"
        placeholder="Ciudad"
        value={data.city}
        onChange={(e) => updateData({ city: e.target.value })}
      />
    </div>
  );
}
