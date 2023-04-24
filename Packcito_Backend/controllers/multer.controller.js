const { response } = require('express');
const { prisma } = require('../database');
const multer = require('multer');
const mime = require('mime');

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
      const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
      const fileMime = mime.lookup(file.originalname);
  
      if (!allowedMimes.includes(fileMime)) {
        return cb(new Error('Solo se permiten imágenes.'))
      }
      cb(null, true)
    }
  })

const uploadMultiple = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      // Allowed file types
      const filetypes = /jpeg|jpg|png|gif|mp4|wav|mp3/;
      // Check the file extension
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      // Check the MIME type
      const mimetype = filetypes.test(file.mimetype);
      if (extname && mimetype) {
        // File type is allowed
        cb(null, true);
      } else {
        // File type is not allowed
        cb(new Error('Solo se permiten imágenes, videos o pistas de audio.'));
      }
    },
  });

module.exports = { upload, uploadMultiple }