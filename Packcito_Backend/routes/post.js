const { Router } = require('express');
const { createPost, getAllPostsByPackage, getPostsByPackage, deletePost, updatePost, getAllPosts } = require('../controllers/post.controller');
const { verifyToken } = require('../controllers/user.controller')

const router = Router();

//rutas
router.post('/createPost/:idPackage', verifyToken, createPost); 
router.get('/getAllPosts/', getAllPosts); 
router.get('/getAllPostsByPackage/:idPackage', getAllPostsByPackage); 
router.get('/getPost/:packageId/:postId', getPostsByPackage);
router.delete('/deletePost/:postId', verifyToken, deletePost); 
router.put('/updatePost/:postId', verifyToken, updatePost); 

module.exports = router;