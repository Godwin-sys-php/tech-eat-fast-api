const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

module.exports = (width, folder) => {
  return async (req, res, next) => {
    if (req.file && req.file.filename) {
      try {
        await sharp(path.join(__dirname, `../../${folder}`, req.file.filename))
          .resize(width)
          .toFile(path.join(__dirname, `../../${folder}`, `resized-${req.file.filename}`));
  
        fs.unlinkSync(path.join(__dirname, `../../${folder}`, req.file.filename));
        req.file.filename = `resized-${req.file.filename}`;
  
        next();
      } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        return res.status(500).json({ error: true });
      }
    } else {
      next();
    }
  }
}