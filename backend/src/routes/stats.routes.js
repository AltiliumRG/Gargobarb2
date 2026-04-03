const express = require("express");
const router = express.Router();

const { verifyToken, requireRole } = require("../middleware/auth.middleware");
const { getBarberStats } = require("../controllers/stats.controller");

router.get(
  "/barber",
  verifyToken,      // 🔥 obligatorio
  requireRole(2),   // 🔥 obligatorio
  getBarberStats
);

module.exports = router;