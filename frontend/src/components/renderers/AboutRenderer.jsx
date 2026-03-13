export default function AboutRenderer({
  section,
  content = {},
  styles = {},
}) {
  const {
    title = "Sobre nosotros",
    text = "Somos una barbería profesional enfocada en estilo, precisión y experiencia al cliente."
  } = content;

  return (
    <section
      className="relative py-32 px-6 overflow-hidden"
      style={{
        color: styles.textColor || "#ffffff"
      }}
    >
      {/* 🔥 Animated ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-yellow-500/10 blur-[140px] rounded-full top-[-150px] right-[-150px] animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-yellow-400/10 blur-[120px] rounded-full bottom-[-120px] left-[-120px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-20 items-center">

        {/* ✨ TEXT SIDE */}
        <div
          className="space-y-8"
          style={{
            animation: "fadeSlide 0.8s ease forwards",
            opacity: 0
          }}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            {title}
          </h2>

          {/* Decorative line */}
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full" />

          <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
            {text}
          </p>

          {/* CTA subtle */}
          <div className="pt-4">
            <span className="text-yellow-400 font-semibold tracking-wide text-sm uppercase">
              Experiencia premium · Estilo auténtico
            </span>
          </div>
        </div>

        {/* 💎 VISUAL SIDE */}
        <div
          className="relative"
          style={{
            animation: "fadeSlide 1s ease forwards",
            animationDelay: "200ms",
            opacity: 0
          }}
        >
          {/* Glass card */}
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

            <div className="text-7xl text-yellow-400 opacity-10 absolute top-6 left-8">
              ✂
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-gray-400 text-sm tracking-wide">
                  Profesionalismo
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-300" />
                <span className="text-gray-400 text-sm tracking-wide">
                  Precisión
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-700" />
                <span className="text-gray-400 text-sm tracking-wide">
                  Estilo moderno
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 🎬 Keyframes */}
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