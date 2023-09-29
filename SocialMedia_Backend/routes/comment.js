const { Router } = require('express');
const { createComment, getAllComments, getCommentsByPost, getCommentsByUser, getCommentsByUserPost, deleteComment, updateComment } = require('../controllers/comment.controller');
const { verifyToken } = require('../controllers/user.controller')
const router = Router();

router.post('/createComment/:userId/:postId', verifyToken, createComment); 
router.get('/getAllComments', getAllComments); 
router.get('/getCommentsByPost/:postId', getCommentsByPost); 
router.get('/getCommentsByUser/:userId', getCommentsByUser);
router.get('/getCommentsByUserPost/:userId/:postId', getCommentsByUserPost);
router.delete('/deleteComment/:userId/:commentId', verifyToken, deleteComment); 
router.put('/updateComment/:userId/:commentId', verifyToken, updateComment)

module.exports = router;