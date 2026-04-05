const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");

// Notar que estas son públicas (no requieren token de usuario autenticado)
router.post("/track", analyticsController.trackVisit);
router.post("/duration", analyticsController.updateDuration);

module.exports = router;
