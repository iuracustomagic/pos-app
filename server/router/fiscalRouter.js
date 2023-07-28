const express = require('express');
const router = express.Router();
const fiscalCalls = require('../controllers/fiscal');

router.get('/fiscal/report', fiscalCalls.execReport);

module.exports = router;
