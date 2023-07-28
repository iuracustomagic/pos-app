/* eslint-disable import/newline-after-import */
const express = require('express');
const router = express.Router();
const paymentsCalls = require('../controllers/transactions');

router.get('/payments/transaction', paymentsCalls.getTransactions);
router.post('/payments/add', paymentsCalls.newPayment);
router.post('/payments/return', paymentsCalls.returnProduct);

module.exports = router;
