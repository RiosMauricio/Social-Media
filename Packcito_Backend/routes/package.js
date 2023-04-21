const { Router } = require('express');
const { createPackage, getAllPacksByUser, getPackageByUser, deletePackage, getAllPackages, updatePackage } = require('../controllers/package.controller');
const { verifyToken } = require('../controllers/user.controller')

const router = Router();

//rutas
router.post('/createPackage/:idUser', verifyToken,createPackage);
router.get('/getPacks', getAllPackages);
router.get('/getPacks/:idUser', getAllPacksByUser); 
router.get('/getPack/:userId/:packageId', getPackageByUser);
router.delete('/delete/:packageId', verifyToken, deletePackage);
router.put('/updatePackage/:packageId', verifyToken, updatePackage)


module.exports = router;
