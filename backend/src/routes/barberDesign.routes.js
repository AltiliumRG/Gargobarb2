//express
const express = require("express");
//express router
const router = express.Router();

const {
  saveDesign,
  getDesign,
} = require("../controllers/barberDesign.controller");

const {
  verifyToken,
  requireRole,
} = require("../middleware/auth.middleware");

router.post("/", verifyToken, requireRole(2), saveDesign);
router.get("/:barbershopId", getDesign);

module.exports = router;
