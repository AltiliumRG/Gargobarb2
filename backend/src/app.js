// ===============================================
// 🌐 backend/src/app.js
// Configuración principal del servidor Express
// ===============================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middleware/error.middleware");

// ===============================================
// 🔗 Importar rutas
// ===============================================
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const barbershopRoutes = require("./routes/barbershop.routes");
const serviceRoutes = require("./routes/service.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const uploadRoutes = require("./routes/upload.routes");

const siteRoutes = require("./routes/site.routes");


const barberDesignRoutes = require("./routes/barberDesign.routes");
const barberPublicRoutes = require("./routes/barberPublic.routes");
const app = express();

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

// ===============================================
// 🛡️ Middlewares globales de seguridad
// ===============================================
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,  // DESACTIVA CSP (también rompe Google)
  })
);
app.set("trust proxy", 1);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===============================================
// 🌐 CORS PROFESIONAL
// ===============================================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


// ===============================================
// 📜 Logger HTTP
// ===============================================
app.use(morgan("dev"));


// ===============================================
// 🔒 Rate Limit Global — EXCLUYENDO GOOGLE LOGIN
// ===============================================

// Límite global normal
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: "Demasiadas peticiones, intenta más tarde." },
});

// Límite especial para Google (más permisivo)
const googleLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50, // más alto para evitar 429
});

// Middleware que excluye Google del limite global
app.use((req, res, next) => {
  if (req.path === "/api/auth/google") return googleLimiter(req, res, next);
  return globalLimiter(req, res, next);
});

// ===============================================
// 🖼️ Archivos estáticos
// ===============================================
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ===============================================
// 🧠 Ruta de prueba
// ===============================================
app.get("/api/health", (req, res) => {
  res.json({ ok: true, status: "API funcionando correctamente 🚀" });
});

// ===============================================
// 🚀 Rutas principales
// ===============================================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/barbershops", barbershopRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/upload", uploadRoutes);
// ===============================================
// 🚀 Rutas principales
// ===============================================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// 🧔‍♂️ BARBERO (creación y diseño de su página)
app.use("/api/barber/design", barberDesignRoutes);

// 🏪 BARBERÍAS (CRUD general)
app.use("/api/barbershops", barbershopRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);

// 🌍 PÚBLICO (clientes ven la barbería por slug)
app.use("/api/b", barberPublicRoutes);

app.use("/api/upload", uploadRoutes);

// 🧱 SITIOS (builder de barberías)
app.use("/api/sites", siteRoutes);


// ===============================================
// ⚠️ Error Handler
// ===============================================
app.use(errorHandler);

// ===============================================
// 📤 Exportar app
// ===============================================
module.exports = app;
