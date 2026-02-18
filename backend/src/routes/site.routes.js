const express = require("express");
const router = express.Router();

const { verifyToken, requireRole } = require("../middleware/auth.middleware");
const ctrl = require("../controllers/SiteBuilder.controller");

// Obtener builder completo
router.get(
  "/builder/:barbershopId",
  verifyToken,
  requireRole(2),
  ctrl.getBuilder
);

// Guardar cambios del builder
router.post(
  "/builder/save",
  verifyToken,
  requireRole(2),
  ctrl.saveBuilder
);

// Publicar sitio
router.post(
  "/builder/publish/:siteId",
  verifyToken,
  requireRole(2),
  ctrl.publish
);

module.exports = router;
