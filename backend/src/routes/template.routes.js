const router = require("express").Router();
const ctrl = require("../controllers/template.controller");

router.get("/section/:type", ctrl.getSectionTemplate);

module.exports = router;