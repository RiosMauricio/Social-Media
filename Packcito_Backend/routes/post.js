const { Router } = require('express');
const { createPost, getPost, getAllPostsByPackage, getPostsByPackage, deletePost, updatePost, getAllPosts } = require('../controllers/post.controller');
const { uploadMultiple } = require('../controllers/multer.controller');

const { verifyToken } = require('../controllers/user.controller')

const router = Router();

//rutas
router.post('/createPost/:idPackage', verifyToken, uploadMultiple.array('media'), createPost); 
router.get('/getAllPosts/', getAllPosts); 
router.get('/getPost/:postId', getPost);
router.get('/getAllPostsByPackage/:idPackage', verifyToken, getAllPostsByPackage); 
router.get('/getPost/:packageId/:postId', verifyToken, getPostsByPackage);
router.delete('/deletePost/:postId', verifyToken, deletePost); 
router.put('/updatePost/:postId', verifyToken, updatePost); 

module.exports = router;