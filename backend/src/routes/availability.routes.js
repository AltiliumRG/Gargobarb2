const express = require("express");
const router = express.Router();
const availabilityController = require("../controllers/availability.controller");

router.get(
  "/:barbershopId",
  availabilityController.getAvailability
);

module.exports = router;