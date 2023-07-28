const express = require('express');
const router = express.Router();
const path = require('path');
const buildRoute = path.join(__dirname, '/../../build');

router.get(['/layout', '/'], (req, res) => res.sendFile(`${buildRoute}/index.html`));

module.exports = router;
