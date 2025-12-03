const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limite

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo' });

  res.json({
    buffer: req.file.buffer,
    file_format: req.file.mimetype,
    file_size: req.file.size,
    original_name: req.file.originalname
  });
});

module.exports = router;