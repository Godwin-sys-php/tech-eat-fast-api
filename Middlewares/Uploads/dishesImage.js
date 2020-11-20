module.exports = (req, res, next) => {
  if (req.files && req.files.imageDish) {
    const MIME_TYPES = {
      "image/jpg": "jpg",
      "image/jpeg": "jpg",
      "image/png": "png",
    };
    const MIME_TYPES_ARRAY = [
      "image/jpg",
      "image/jpeg",
      "image/png"
    ];
    const imageUpload = req.files.imageDish;
    
    if (MIME_TYPES_ARRAY.includes(imageUpload.mimetype)) {
      const extension = MIME_TYPES[imageUpload.mimetype];
      const timestamp = Date.now();
      imageUpload.mv(`./Images-Dishes/${imageUpload.name}_${timestamp}.${extension}`);
      req.file = { filename: `${imageUpload.name}_${timestamp}.${extension}` };
      next();
    } else {
      res.status(400).json({ badFile: true });
    }
  } else {
    res.status(400).json({ needImage: true });
  }
};
