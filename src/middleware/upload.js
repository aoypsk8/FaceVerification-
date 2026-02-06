import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    file.mimetype.startsWith('image/') 
      ? cb(null, true) 
      : cb(new Error('Please upload image files only'), false);
  },
});

export const uploadFields = upload.fields([
  { name: 'selfie', maxCount: 1 },
  { name: 'idDocument', maxCount: 1 },
]);
