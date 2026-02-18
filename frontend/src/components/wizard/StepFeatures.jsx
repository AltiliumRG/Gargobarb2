import { useWizard } from "../../context/WizardContext";

export default function StepFeatures() {
  const { data, updateData } = useWizard();

  const toggle = (key) => {
    updateData({
      features: {
        ...data.features,
        [key]: !data.features[key],
      },
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Funcionalidades del sitio
      </h2>

      <div className="space-y-4">
        {Object.entries(data.features).map(([key, value]) => (
          <label
            key={key}
            className="flex items-center justify-between bg-gray-800 p-4 rounded cursor-pointer"
          >
            <span className="capitalize">{key}</span>
            <input
              type="checkbox"
              checked={value}
              onChange={() => toggle(key)}
              className="w-5 h-5"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
