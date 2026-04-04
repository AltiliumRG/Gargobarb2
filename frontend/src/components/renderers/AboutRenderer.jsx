import { useTilt } from "../../hooks/useTilt";
import BarberMachine from "./BarberMachine";

export default function AboutRenderer({
  section,
  content = {},
  styles = {},
}) {
  const {
    title = "Sobre nosotros",
    text = "Somos una barbería profesional enfocada en estilo, precisión y experiencia al cliente.",
    barbers = [],

    // 🔥 NUEVOS CAMPOS DINÁMICOS
    features = [
      "Profesionalismo",
      "Precisión",
      "Estilo moderno",
    ],

    tagline = "Experiencia premium · Estilo auténtico",

    barbersTitle = "Nuestros Barberos",
    barbersSubtitle = "Profesionales listos para tu mejor estilo",

    showMachine = true,
  } = content;

  const tiltRef = useTilt();

  return (
    <section
      className="relative py-32 px-6 overflow-hidden"
      style={{
        color: styles.textColor || "#ffffff",
      }}
    >
      {/* 🔥 AMBIENT GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-yellow-500/10 blur-[140px] rounded-full top-[-150px] right-[-150px] animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-yellow-400/10 blur-[120px] rounded-full bottom-[-120px] left-[-120px] animate-pulse delay-1000" />
      </div>

      {/* 🔥 GRID PRINCIPAL */}
      <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-20 items-center">

        {/* ✨ TEXTO */}
        <div
          className="space-y-8"
          style={{
            animation: "fadeSlide 0.8s ease forwards",
            opacity: 0,
            textAlign: styles.align || "left",
          }}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            {title}
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full" />

          <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
            {text}
          </p>

          {/* 🔥 TAGLINE EDITABLE */}
          {tagline && (
            <span className="text-yellow-400 font-semibold tracking-wide text-sm uppercase">
              {tagline}
            </span>
          )}
        </div>

        {/* 💎 CARD DERECHA (EDITABLE) */}
        <div
          ref={tiltRef}
          className="relative"
          style={{
            animation: "fadeSlide 1s ease forwards",
            animationDelay: "200ms",
            opacity: 0,
          }}
        >
          <div className="
            relative
            rounded-3xl
            bg-white/[0.04]
            backdrop-blur-xl
            border border-white/10
            p-12
            shadow-[0_0_60px_rgba(0,0,0,0.6)]
            hover:shadow-[0_0_80px_rgba(250,204,21,0.2)]
            transition-all duration-500
            hover:-translate-y-4
          ">

            {/* ✂ ICON */}
            <div className="text-7xl text-yellow-400 opacity-10 absolute top-6 left-8">
              ✂
            </div>

            {/* 🔥 FEATURES DINÁMICOS */}
            <div className="space-y-6 relative z-10">
              {features.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                  <span className="text-gray-400 text-sm tracking-wide">
                    {item}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* 💈 SECCIÓN BARBEROS + MÁQUINA */}
      {(showMachine || barbers.length > 0) && (
        <div className="max-w-7xl mx-auto mt-32">

          {/* 🔥 TÍTULO EDITABLE */}
          

          {/* 🔥 LAYOUT INTELIGENTE */}
          <div className={`
            flex flex-col md:flex-row items-center justify-center gap-16
          `}>

            {/* 💈 MÁQUINA */}
            {showMachine && (
              <div className="flex-shrink-0">
                <BarberMachine 
  barbers={barbers} 
 show={content.showMachine !== false}
  title={content.barbersTitle}
  subtitle={content.barbersSubtitle}
/>
              </div>
            )}

            {/* 💈 BARBEROS */}
            

          </div>
        </div>
      )}

      {/* 🎬 ANIMACIÓN */}
      <style>{`
        @keyframes fadeSlide {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0px);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}