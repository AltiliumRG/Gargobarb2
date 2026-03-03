const router = require("express").Router();
const geoController = require("../controllers/geo.controller");

router.get("/departments", geoController.getDepartments);
router.get("/cities/:departmentId", geoController.getCitiesByDepartment);

module.exports = router;