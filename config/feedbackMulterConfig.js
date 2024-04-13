// import path from 'path';
// import express from 'express';
// import multer from 'multer';
// import fs from 'fs';

// const router = express.Router();

// // Geri bildirim fotoğrafları için klasörü kontrol et ve yoksa oluştur
// const feedbackPhotosDir = 'feedback-photos/';
// if (!fs.existsSync(feedbackPhotosDir)) {
//   fs.mkdirSync(feedbackPhotosDir, { recursive: true });
// }

// const storageFeedback = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, feedbackPhotosDir);
//   },
//   filename(req, file, cb) {
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// export const uploadFeedback = multer({
//   storage: storageFeedback,
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// });

// export default router;
