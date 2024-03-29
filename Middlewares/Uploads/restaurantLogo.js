module.exports = async (req, res, next) => {
  if (req.files && req.files.logo) {
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
    const imageUpload = req.files.logo;
    
    if (MIME_TYPES_ARRAY.includes(imageUpload.mimetype)) {
      const extension = MIME_TYPES[imageUpload.mimetype];
      const timestamp = Date.now();
      await imageUpload.mv(`./Images-Resto/${req.params.idRestaurant}.${timestamp}.${extension}`);
      req.file = { filename: `${req.params.idRestaurant}.${timestamp}.${extension}` };
      next();
    } else {
      res.status(400).json({ badFile: true });
    }
  } else {
    next();
  }
};
