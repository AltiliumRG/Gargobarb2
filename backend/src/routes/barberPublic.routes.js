const express = require("express");
const router = express.Router();

const {
  getPublicBarbershop,
} = require("../controllers/barberPublic.controller");

router.get("/:slug", getPublicBarbershop);

module.exports = router;
