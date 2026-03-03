const router = require("express").Router();
const controller = require("./dashboard.controller");
const { verifyToken } = require("../../middleware/auth.middleware");

router.get(
  "/overview/:barbershopId",
  verifyToken,
  controller.getOverview
);

module.exports = router;