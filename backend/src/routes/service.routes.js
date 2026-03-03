const express = require("express");
const router = express.Router();

const serviceController = require("../controllers/service.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

router.post(
  "/",
  verifyToken,
  requireRole(1, 2),
  serviceController.createService
);

router.get("/barbershop/:id", serviceController.getServicesByBarbershop);

router.put(
  "/:id",
  verifyToken,
  requireRole(1, 2),
  serviceController.updateService
);

router.delete(
  "/:id",
  verifyToken,
  requireRole(1, 2),
  serviceController.deleteService
);

module.exports = router;