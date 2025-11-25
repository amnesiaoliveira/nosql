const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../public/uploads');
['images', 'audios', 'videos', 'files'].forEach(dir => {
  fs.mkdirSync(path.join(uploadDir, dir), { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'files';
    if (file.mimetype.startsWith('image/')) folder = 'images';
    else if (file.mimetype.startsWith('audio/')) folder = 'audios';
    else if (file.mimetype.startsWith('video/')) folder = 'videos';
    cb(null, path.join(uploadDir, folder));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
  }
});

const upload = multer({ storage });

module.exports = upload;