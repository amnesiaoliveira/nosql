const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const path = require('path');

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo' });
  
  const url = `/uploads/${req.file.destination.split('uploads/')[1]}${req.file.filename}`;
  res.json({
    url,
    file_format: req.file.mimetype,
    file_size: req.file.size
  });
});

module.exports = router;