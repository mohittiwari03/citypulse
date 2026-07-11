import { useEffect, useRef } from "react";

// Map OpenWeather icon codes → animation type
function getCondition(icon = "") {
  if (!icon) return "clear";
  const code = icon.replace("d", "").replace("n", "");
  if (["01"].includes(code))             return "clear";
  if (["02", "03", "04"].includes(code)) return "cloudy";
  if (["09", "10"].includes(code))       return "rain";
  if (["11"].includes(code))             return "storm";
  if (["13"].includes(code))             return "snow";
  if (["50"].includes(code))             return "mist";
  return "clear";
}

// ── Particle factories (light‐bg‐friendly, very subtle) ──────────────────────

function makeRain(canvas) {
  const drops = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    len:   6 + Math.random() * 10,
    speed: 8 + Math.random() * 8,
    opacity: 0.06 + Math.random() * 0.08,
  }));
  return (ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#7EB8FF";
    drops.forEach((d) => {
      ctx.globalAlpha = d.opacity;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 1, d.y + d.len);
      ctx.stroke();
      d.y += d.speed;
      if (d.y > canvas.height) { d.y = -d.len; d.x = Math.random() * canvas.width; }
    });
    ctx.globalAlpha = 1;
  };
}

function makeSnow(canvas) {
  const flakes = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 1.5 + Math.random() * 3,
    speed: 0.4 + Math.random() * 0.8,
    drift: (Math.random() - 0.5) * 0.3,
    opacity: 0.08 + Math.random() * 0.12,
  }));
  return (ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flakes.forEach((f) => {
      ctx.globalAlpha = f.opacity;
      ctx.fillStyle = "#B0BEC5";
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
      f.y += f.speed;
      f.x += f.drift;
      if (f.y > canvas.height) { f.y = -f.r; f.x = Math.random() * canvas.width; }
    });
    ctx.globalAlpha = 1;
  };
}

function makeStorm(canvas) {
  const rain = makeRain(canvas);
  let lightningTimer = 0;
  let lightningAlpha = 0;
  return (ctx) => {
    rain(ctx);
    lightningTimer++;
    if (lightningTimer > 90 + Math.random() * 120) {
      lightningAlpha = 0.06;
      lightningTimer = 0;
    }
    if (lightningAlpha > 0) {
      ctx.fillStyle = `rgba(79,110,247,${lightningAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      lightningAlpha -= 0.005;
    }
  };
}

function makeClear(canvas) {
  let angle = 0;
  const cx = canvas.width * 0.85;
  const cy = canvas.height * 0.12;
  const particles = Array.from({ length: 20 }, () => ({
    angle: Math.random() * Math.PI * 2,
    r:     40 + Math.random() * 60,
    speed: 0.002 + Math.random() * 0.003,
    size:  1 + Math.random() * 1.5,
    opacity: 0.03 + Math.random() * 0.05,
  }));
  return (ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    angle += 0.003;
    // Sun glow
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100);
    grad.addColorStop(0, "rgba(255,210,100,0.06)");
    grad.addColorStop(1, "rgba(255,210,100,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 100, 0, Math.PI * 2);
    ctx.fill();
    // Rays
    for (let i = 0; i < 8; i++) {
      const a = angle + (i * Math.PI) / 4;
      ctx.globalAlpha = 0.02;
      ctx.strokeStyle = "#FFD96A";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * 25, cy + Math.sin(a) * 25);
      ctx.lineTo(cx + Math.cos(a) * 70, cy + Math.sin(a) * 70);
      ctx.stroke();
    }
    // Floating particles
    particles.forEach((p) => {
      p.angle += p.speed;
      const px = cx + Math.cos(p.angle) * p.r;
      const py = cy + Math.sin(p.angle) * p.r;
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = "#FFD96A";
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  };
}

function makeCloudy(canvas) {
  const clouds = Array.from({ length: 3 }, (_, i) => ({
    x: (canvas.width / 3) * i,
    y: 30 + Math.random() * 60,
    r: 35 + Math.random() * 25,
    speed: 0.1 + Math.random() * 0.15,
    opacity: 0.03 + Math.random() * 0.04,
  }));
  return (ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clouds.forEach((c) => {
      ctx.globalAlpha = c.opacity;
      ctx.fillStyle = "#8A92A6";
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.arc(c.x + c.r * 0.6, c.y - c.r * 0.3, c.r * 0.7, 0, Math.PI * 2);
      ctx.arc(c.x + c.r * 1.2, c.y, c.r * 0.6, 0, Math.PI * 2);
      ctx.fill();
      c.x += c.speed;
      if (c.x > canvas.width + c.r * 2) c.x = -c.r * 2;
    });
    ctx.globalAlpha = 1;
  };
}

function makeMist(canvas) {
  const bands = Array.from({ length: 5 }, (_, i) => ({
    y: (canvas.height / 5) * i + 20,
    x: Math.random() * canvas.width,
    w: canvas.width * (0.5 + Math.random() * 0.4),
    speed: 0.15 + Math.random() * 0.2,
    opacity: 0.03 + Math.random() * 0.04,
  }));
  return (ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bands.forEach((b) => {
      ctx.globalAlpha = b.opacity;
      const grad = ctx.createLinearGradient(b.x, b.y, b.x + b.w, b.y);
      grad.addColorStop(0, "rgba(138,146,166,0)");
      grad.addColorStop(0.5, "rgba(138,146,166,1)");
      grad.addColorStop(1, "rgba(138,146,166,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(b.x, b.y, b.w, 14);
      b.x += b.speed;
      if (b.x > canvas.width) b.x = -b.w;
    });
    ctx.globalAlpha = 1;
  };
}

// ── Component ────────────────────────────────────────────────────────────────

export default function WeatherBackground({ icon }) {
  const canvasRef = useRef(null);
  const condition = getCondition(icon);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawMap = {
      rain:   makeRain,
      snow:   makeSnow,
      storm:  makeStorm,
      clear:  makeClear,
      cloudy: makeCloudy,
      mist:   makeMist,
    };
    const draw = (drawMap[condition] || makeClear)(canvas);

    let raf;
    const loop = () => { draw(ctx); raf = requestAnimationFrame(loop); };
    loop();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [condition]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 1 }}
    />
  );
}

export { getCondition };
