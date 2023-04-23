const { Router } = require('express');
const { createUser, getAllUsers, getUserById, deleteUser, modifyUser, 
        userLogin, verifyToken, getUserCategories, modifyPassword, updateProfilePhoto, updateBanner} = require('../controllers/user.controller');
const { upload } = require('../controllers/multer.controller');
const router = Router();

//rutas
router.post('/createUser', createUser);
router.post('/login', userLogin);
router.post('/updateProfilePhoto/:id', upload.single('file'), updateProfilePhoto)
router.post('/updateBanner/:id', upload.single('file'), updateBanner)
router.get('/getUsers',verifyToken, getAllUsers);
router.get('/getUser/:id', getUserById);
router.get('/getUserCategories/:id', getUserCategories)
router.delete('/deleteUser/:id', deleteUser);
router.put('/updateUser/:id', verifyToken, modifyUser); 
router.put('/updatePassword/:id', verifyToken, modifyPassword)


module.exports = router;
