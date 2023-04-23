const { response } = require('express');
const { prisma } = require('../database');
const multer = require('multer');

//Multer para subida de archivos a la base de datos.
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Solo se permiten imágenes.'))
        }
        cb(null, true)
    }
})

module.exports = { upload }