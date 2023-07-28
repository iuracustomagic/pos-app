/* eslint-disable import/newline-after-import */
const express = require('express');
const router = express.Router();
const userCalls = require('../controllers/user');

router.get('/users/user', userCalls.getUserById);
router.get('/users/logout', userCalls.logout);
router.get('/users/all', userCalls.getAllUsers);
router.post('/users/login', userCalls.logging);
router.post('/users/register', userCalls.registering);
router.post('/users/post', userCalls.updateUser);
router.delete('/users/user', userCalls.deleteUserById);

module.exports = router;
