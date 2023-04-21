const { Router } = require('express');
const { createCategory, getAllCategories, getCategoryById } = require('../controllers/category.controller');
const router = Router();

//rutas
router.post('/create', createCategory);
router.get('/getall', getAllCategories); 
router.get('/getCategoryById/:id', getCategoryById)

module.exports = router;