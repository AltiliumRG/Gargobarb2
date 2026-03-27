import { useWizard } from "../../context/WizardContext";

export default function StepDesign() {
  const { data, updateData } = useWizard();

  const templates = [
    { id: "default", name: "Clásico", icon: "💈" },
    { id: "modern", name: "Moderno", icon: "⚡" },
    { id: "dark", name: "Oscuro Premium", icon: "🌙" }
  ];

  const fonts = [
    { id: "Roboto", name: "Roboto (Limpia y moderna)" },
    { id: "Inter", name: "Inter (Elegante y legible)" },
    { id: "Montserrat", name: "Montserrat (Estilizada y geométrica)" }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500 text-xl">🎨</div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Personaliza tu Diseño
        </h2>
      </div>

      <div className="space-y-10">
        {/* Templates */}
        <div>
          <label className="block text-gray-400 font-bold mb-4 text-sm uppercase tracking-wider">Estilo de Plantilla</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => updateData({ template: tpl.id })}
                className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 border-2 ${data.template === tpl.id ? 'border-yellow-500 bg-yellow-500/10 scale-105 shadow-[0_0_20px_rgba(250,204,21,0.2)]' : 'border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:border-gray-700'}`}
              >
                <span className="text-4xl drop-shadow-sm">{tpl.icon}</span>
                <span className={`font-bold ${data.template === tpl.id ? 'text-yellow-500' : 'text-gray-300'}`}>{tpl.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Colores */}
        <div>
          <label className="block text-gray-400 font-bold mb-4 text-sm uppercase tracking-wider">Paleta de Colores</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900/30 p-6 rounded-3xl border border-white/5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300">Color Primario (Fondo oscuro)</label>
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-inner border-2 border-white/10 shrink-0">
                  <input
                    type="color"
                    value={data.primaryColor}
                    onChange={(e) => updateData({ primaryColor: e.target.value })}
                    className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer"
                  />
                </div>
                <div className="text-gray-400 font-mono text-sm uppercase bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">{data.primaryColor}</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300">Color Secundario (Botones y destacados)</label>
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-inner border-2 border-white/10 shrink-0">
                  <input
                    type="color"
                    value={data.secondaryColor}
                    onChange={(e) => updateData({ secondaryColor: e.target.value })}
                    className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer"
                  />
                </div>
                <div className="text-gray-400 font-mono text-sm uppercase bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">{data.secondaryColor}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fuente */}
        <div>
          <label className="block text-gray-400 font-bold mb-4 text-sm uppercase tracking-wider">Tipografía Principal</label>
          <div className="relative group">
            <select
              value={data.fontFamily}
              onChange={(e) => updateData({ fontFamily: e.target.value })}
              className="w-full p-4 bg-gray-900/50 border border-gray-800 rounded-2xl text-white font-semibold appearance-none cursor-pointer hover:border-yellow-500/50 hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              {fonts.map(font => (
                <option key={font.id} value={font.id}>{font.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-yellow-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
