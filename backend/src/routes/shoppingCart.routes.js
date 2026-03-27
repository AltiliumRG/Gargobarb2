const express = require('express');
const router = express.Router();
const shoppingCartController = require('../controllers/shoppingCart.controller');

// Create a new shopping cart (Public endpoint for clients checking out)
router.post('/', shoppingCartController.createShoppingCart);

// Get shopping carts by site (For admin/statistics)
router.get('/site/:siteId', shoppingCartController.getShoppingCartsBySite);

module.exports = router;
