import { useWizard } from "../../context/WizardContext";

export default function StepDesign() {
  const { data, updateData } = useWizard();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Diseño del sitio
      </h2>

      <div className="space-y-6">
        {/* Template */}
        <div>
          <label className="block mb-2">Plantilla</label>
          <select
            value={data.template}
            onChange={(e) => updateData({ template: e.target.value })}
            className="w-full p-3 bg-gray-800 rounded"
          >
            <option value="default">Default</option>
            <option value="modern">Modern</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Colores */}
        <div className="flex gap-4">
          <div>
            <label className="block mb-2">Color primario</label>
            <input
              type="color"
              value={data.primaryColor}
              onChange={(e) =>
                updateData({ primaryColor: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2">Color secundario</label>
            <input
              type="color"
              value={data.secondaryColor}
              onChange={(e) =>
                updateData({ secondaryColor: e.target.value })
              }
            />
          </div>
        </div>

        {/* Fuente */}
        <div>
          <label className="block mb-2">Fuente</label>
          <select
            value={data.fontFamily}
            onChange={(e) =>
              updateData({ fontFamily: e.target.value })
            }
            className="w-full p-3 bg-gray-800 rounded"
          >
            <option value="Roboto">Roboto</option>
            <option value="Inter">Inter</option>
            <option value="Montserrat">Montserrat</option>
          </select>
        </div>
      </div>
    </div>
  );
}
