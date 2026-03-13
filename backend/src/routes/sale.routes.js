const express = require('express');
const router = express.Router();
const saleController = require('../controllers/Sale.controller');

router.post('/', saleController.createSale);
router.get('/:barbershopId', saleController.getSalesByBarbershop);
router.get('/data/:barbershopId', saleController.getRequiredDataForSale);

router.post('/bulk', saleController.bulkCreateSales);

module.exports = router;
