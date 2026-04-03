import BarberMachineParticles from "./BarberMachineParticles";

export default function BarberMachine({
  barbers = [],
  show = true,
  title = "Nuestros Barberos",
  subtitle = "Profesionales listos para tu mejor estilo",
}) {

  return (
    <div className="mt-24 max-w-7xl mx-auto">

      {/* 🔥 LAYOUT INTELIGENTE */}
      <div className="grid md:grid-cols-2 gap-16 items-center">

        {/* 💈 IZQUIERDA → MÁQUINA */}
        <div className="flex justify-center items-center">

  {show ? (
    <div className="scale-[1.4] md:scale-[1.6] transition-all duration-500">
      <BarberMachineParticles />
    </div>
  ) : (
    <div className="w-full h-[350px] opacity-0 pointer-events-none" />
  )}

</div>

        {/* 💈 DERECHA → CONTENIDO */}
        <div
  className={`
    w-full transition-all duration-500
    ${!show ? "md:col-span-2 text-center max-w-5xl mx-auto" : ""}
  `}
>

          {/* 🔥 TITULO */}
          <h2 className="text-4xl md:text-5xl font-bold text-white">
  {title || "Nuestros Barberos"}
</h2>

<p className="text-gray-400 mt-2 mb-10">
  {subtitle || "Profesionales listos para tu mejor estilo"}
</p>

          {/* 💈 GRID BARBEROS */}
          <div
            className={`
              grid gap-6
              ${show ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"}
            `}
          >

            {barbers.map((barber, i) => (
              <div
                key={i}
                className="
                  group relative rounded-xl overflow-hidden
                  bg-white/[0.05] border border-white/10
                  hover:scale-105 transition duration-300
                "
              >

                {/* 🖼️ IMAGEN */}
                {barber.image ? (
                  <img
                    src={barber.image}
                    className="
                      w-full h-44 object-cover
                      transition duration-500
                      group-hover:scale-110
                    "
                  />
                ) : (
                  <div className="w-full h-44 flex items-center justify-center text-gray-500 text-sm">
                    Sin imagen
                  </div>
                )}

                {/* 🌑 OVERLAY */}
                <div className="absolute inset-0 bg-black/50 opacity-60 group-hover:opacity-80 transition" />

                {/* 🔥 INFO */}
                <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black/90 to-transparent">

                  <h3 className="text-white text-sm font-bold leading-tight">
                    {barber.name || "Nombre"}
                  </h3>

                  <p className="text-yellow-400 text-xs">
                    {barber.role || "Barbero"}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}