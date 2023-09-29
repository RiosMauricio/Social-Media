const { Router } = require('express');
const { createUser, getAllUsers, getUserById, deleteUser, modifyUser, getUserByUsername, 
        userLogin, verifyToken, getUserCategories, modifyPassword, updateProfilePhoto, updateBanner} = require('../controllers/user.controller');
const { upload } = require('../controllers/multer.controller');
const router = Router();

//rutas
router.post('/createUser', createUser);
router.post('/login', userLogin);

//modificar foto de perfil y banner
router.post('/updateProfilePhoto/:id', upload.single('file'), updateProfilePhoto)
router.post('/updateBanner/:id', upload.single('file'), updateBanner)

//resto de metodos get
router.get('/getUsers', getAllUsers);
router.get('/getUser/:id', getUserById);
router.get('/getUserByUsername/:username', getUserByUsername);
router.get('/getUserCategories/:id', getUserCategories)


//resto de operaciones user
router.delete('/deleteUser/:id', verifyToken, deleteUser);
router.put('/updateUser/:id', verifyToken, modifyUser); 
router.put('/updatePassword/:id', verifyToken, modifyPassword)


module.exports = router;
