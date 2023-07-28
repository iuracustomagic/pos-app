/* eslint-disable consistent-return */
const express = require('express');
const router = express.Router();
const { uploadImage } = require('../helpers');
const inventoryCalls = require('../controllers/inventory');

router.get('/products', inventoryCalls.getProducts);
router.get('/product', inventoryCalls.getProductByFilter);
router.post('/products/update', inventoryCalls.updateProduct);
router.post('/products/add', inventoryCalls.addProduct);
router.post('/products/img', uploadImage);
router.delete('/products/delete', inventoryCalls.deleteProduct);

module.exports = router;
