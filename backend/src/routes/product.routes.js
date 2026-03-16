const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

// Rutas de productos
router.post(
    "/products",
    verifyToken,
    requireRole(1, 2),
    productController.createProduct
);

router.get("/barbershop/:barbershopId", productController.getProductsByBarbershop);

router.put(
    "/:id",
    verifyToken,
    requireRole(1, 2),
    productController.updateProduct
);

router.delete(
    "/:id",
    verifyToken,
    requireRole(1, 2),
    productController.deleteProduct
);

module.exports = router;
