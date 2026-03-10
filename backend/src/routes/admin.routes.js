// ============================================================
// 📁 backend/src/routes/admin.routes.js
// ============================================================

const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

// GET /api/admin/dashboard-stats
// Protegido por token, y solo accesible para role_id = 1 (Admin)
router.get("/dashboard-stats", verifyToken, requireRole(1), adminController.getDashboardStats);

// GET /api/admin/users?page=1&limit=10
// Protegido por token, y solo accesible para role_id = 1 (Admin)
router.get("/users", verifyToken, requireRole(1), adminController.getAllUsers);

module.exports = router;
