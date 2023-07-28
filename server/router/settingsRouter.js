/* eslint-disable consistent-return */
const express = require('express');
const router = express.Router();
const settingCalls = require('../controllers/settings');
const { uploadImage } = require('../helpers');

router.get('/settings', settingCalls.getSettings);
router.post('/settings/post', settingCalls.setSettings);
router.post('/settings/stop', settingCalls.killProcess);
router.post('/settings/img', uploadImage);
router.post('/settings/ad-img', uploadImage);

module.exports = router;
