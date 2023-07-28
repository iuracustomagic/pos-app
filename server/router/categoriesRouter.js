const express = require('express');
const router = express.Router();
const categoriesCalls = require('../controllers/categories');

router.post('/category/add', categoriesCalls.addNewCategory);
router.get('/category/all', categoriesCalls.getAllCategories);
router.delete('/category/delete', categoriesCalls.deleteCategory);
router.put('/category/update', categoriesCalls.updateCategory);

module.exports = router;
