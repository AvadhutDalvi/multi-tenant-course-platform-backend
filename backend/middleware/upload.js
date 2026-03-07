const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB for video
  fileFilter: function (req, file, cb) {
    const field = file.fieldname;
    if (field === "video") {
      const allowed = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
      if (allowed.includes(file.mimetype)) return cb(null, true);
      return cb(new Error("Invalid video type. Use MP4, WebM, MOV, or AVI."));
    }
    if (field === "thumbnail") {
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (allowed.includes(file.mimetype)) return cb(null, true);
      return cb(new Error("Invalid image type. Use JPEG, PNG, WebP, or GIF."));
    }
    cb(null, true);
  },
});

const uploadLectureFiles = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

module.exports = {
  uploadLectureFiles,
};
