const { Router } = require('express');
const { createPost, getAllPostsByPackage, getPostsByPackage, deletePost, updatePost, getAllPosts } = require('../controllers/post.controller');
const { upload } = require('../controllers/multer.controller');

const { verifyToken } = require('../controllers/user.controller')

const router = Router();

//rutas
router.post('/createPost/:idPackage', verifyToken, upload.array('media'), createPost); 
router.get('/getAllPosts/', getAllPosts); 
router.get('/getAllPostsByPackage/:idPackage', verifyToken, getAllPostsByPackage); 
router.get('/getPost/:packageId/:postId', verifyToken, getPostsByPackage);
router.delete('/deletePost/:postId', verifyToken, deletePost); 
router.put('/updatePost/:postId', verifyToken, updatePost); 

module.exports = router;