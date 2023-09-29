const { Router } = require('express');
const { createCategory, getAllCategories, getCategoryById, getCategoryUsers } = require('../controllers/category.controller');
const router = Router();

//rutas
router.post('/create', createCategory);
router.get('/getall', getAllCategories); 
router.get('/getCategoryById/:categoryId', getCategoryById); 
router.get('/getCategoryUsers/:categoryId', getCategoryUsers)

module.exports = router;