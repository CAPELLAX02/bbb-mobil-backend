import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}-${path.extname(file.originalname)}`
    );
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post(
  '/',
  upload.fields([{ name: 'image', maxCount: 1 }]),
  (req, res) => {
    if (req.files && req.files.image) {
      const imagePath = `${req.protocol}://${req.get('host')}/${
        req.files.image[0].path
      }`;
      console.log('Uploaded file path:', imagePath);
      res.send({
        message: 'Image uploaded successfully',
        imagePath: imagePath, // Sunucu tarafından oluşturulan resim yolu
      });
    } else {
      console.log('No file uploaded.');
      res.status(400).send('Error: No file uploaded.');
    }
  }
);

export default router;
