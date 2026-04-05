/**
 * Gargobarb Express Application
 * 
 * Main configuration file for the Express server.
 * Includes security middlewares, global rate limiting, route declarations,
 * and error handling.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");

const { errorHandler } = require("./middleware/error.middleware");

// --- Router Imports ---
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const barbershopRoutes = require("./routes/barbershop.routes");
const serviceRoutes = require("./routes/service.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const uploadRoutes = require("./routes/upload.routes");
const siteRoutes = require("./routes/site.routes");
const saleRoutes = require("./routes/sale.routes");
const barberDesignRoutes = require("./routes/barberDesign.routes");
const barberPublicRoutes = require("./routes/barberPublic.routes");
const adminRoutes = require("./routes/admin.routes");
const siteUploadRoutes = require("./routes/siteUpload.routes");
const availabilityRoutes = require("./routes/availability.routes");
const productRoutes = require("./routes/product.routes");
const shoppingCartRoutes = require("./routes/shoppingCart.routes");
const statsRoutes = require("./routes/stats.routes");
const orderRoutes = require("./routes/order.routes");
const notificationRoutes = require("./routes/notification.routes");
const analyticsRoutes = require("./routes/analytics.routes");


const app = express();

// --- Security & Policy Headers ---
app.use((req, res, next) => {
  // Required for Google OAuth and Cross-Origin isolation
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false, // Disabled to allow external assets and Google OAuth
  })
);

app.set("trust proxy", 1); // Trust first proxy (e.g., Nginx, Heroku)

// --- Essential Middlewares ---
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev")); // HTTP request logger

// --- CORS Configuration ---
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/stats", statsRoutes);
// --- Rate Limiting Strategy ---
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 1500, // Augmented limit to prevent 429 locally temporarily
  message: { error: "Demasiadas peticiones. Por favor, intenta de nuevo más tarde." },
});

// Google Login needs a more relaxed limit to avoid inter-app communication issues
const googleLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
});

app.use((req, res, next) => {
  if (req.path === "/api/auth/google") return googleLimiter(req, res, next);
  return globalLimiter(req, res, next);
});

// --- Static Content ---
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// --- API Health Check ---
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    status: "API is healthy and running 🚀",
    timestamp: new Date().toISOString()
  });
});

// --- API Route Definitions ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/barber/design", barberDesignRoutes);
app.use("/api/barbershops", barbershopRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/b", barberPublicRoutes); // Short URL for public sites
app.use("/api/uploads", uploadRoutes);
app.use("/api/uploads", siteUploadRoutes);
app.use("/api/sites", siteRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/geo", require("./routes/geo.routes"));
app.use("/api/dashboard", require("./modules/dashboard/dashboard.routes"));
app.use("/api/templates", require("./routes/template.routes"));
app.use("/api/products", productRoutes);
app.use("/api/shopping-carts", shoppingCartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/stats", statsRoutes);

// --- Global Error Handling ---
app.use(errorHandler);

module.exports = app;
