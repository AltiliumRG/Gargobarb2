import { useEffect, useRef } from "react";

export default function BarberMachineParticles() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = "/clipper.png";

    let particles = [];
    let animationId;

    img.onload = () => {
      const scale = 1;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // 🔥 OFFSCREEN (clave rendimiento)
      const offCanvas = document.createElement("canvas");
      const offCtx = offCanvas.getContext("2d");

      offCanvas.width = canvas.width;
      offCanvas.height = canvas.height;

      offCtx.drawImage(img, 0, 0, offCanvas.width, offCanvas.height);

      const data = offCtx.getImageData(
        0,
        0,
        offCanvas.width,
        offCanvas.height
      ).data;

      particles = [];


      const gap = 40; // 🔥 bloques grandes SIN perder calidad

particles = [];

for (let y = 0; y < offCanvas.height; y += gap) {
  for (let x = 0; x < offCanvas.width; x += gap) {
    particles.push({
      x,
      y,
      originX: x,
      originY: y,
      vx: 0,
      vy: 0,
      size: gap,

      // 🔥 IMPORTANTE: guardar coords de recorte
      sx: x,
      sy: y,
    });
  }
}

      animate();
    };

    let mouse = { x: null, y: null };

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      mouse.x = (e.clientX - rect.left) * scaleX;
      mouse.y = (e.clientY - rect.top) * scaleY;
    });

    canvas.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const forceRadius = 120;
      const forceRadiusSq = forceRadius * forceRadius;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mouse.x !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;

          const distSq = dx * dx + dy * dy;

          // 🔥 SOLO CALCULA SI ESTÁ CERCA (CLAVE FPS)
          if (distSq < forceRadiusSq) {
            const dist = Math.sqrt(distSq) || 1;

            const force = (forceRadius - dist) / forceRadius;

            p.vx += (dx / dist) * force * 100;
            p.vy += (dy / dist) * force * 100;
          }
        }

        // 🔥 SUAVIDAD
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;

        // 🔥 REGRESO
        p.x += (p.originX - p.x) * 0.06;
        p.y += (p.originY - p.y) * 0.06;
        
        ctx.fillStyle = p.color;
        ctx.drawImage(
  img,
  p.sx, // origen X en imagen
  p.sy, // origen Y en imagen
  p.size, // ancho recorte
  p.size, // alto recorte
  p.x, // destino X
  p.y, // destino Y
  p.size, // ancho dibujo
  p.size // alto dibujo
);

      }

      animationId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
  ref={canvasRef}
  className="w-[300px] h-[420px]"
/>
  );
}