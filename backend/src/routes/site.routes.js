const express = require("express");
const router = express.Router();

const { verifyToken, requireRole } = require("../middleware/auth.middleware");
const ctrl = require("../controllers/SiteBuilder.controller");

/* ============================================================
   BUILDER
============================================================ */

// Obtener estructura completa del builder
router.get(
  "/builder/:barbershopId",
  verifyToken,
  requireRole(2),
  ctrl.getBuilder
);

// Guardar cambios (draft)
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

// Cambiar visibilidad del sitio
console.log("verifyToken:", typeof verifyToken);
console.log("requireRole:", typeof requireRole);
console.log("toggleVisibility:", typeof ctrl.toggleVisibility);
router.patch(
  "/builder/visibility/:siteId",
  verifyToken,
  requireRole(2),
  ctrl.toggleVisibility
);

module.exports = router;