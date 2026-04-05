const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB for video
  fileFilter: function (req, file, cb) {
    const field = file.fieldname;

    // 🎥 VIDEO
    if (field === "video") {
      const allowed = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
      if (allowed.includes(file.mimetype)) return cb(null, true);
      return cb(new Error("Invalid video type."));
    }

    // 🖼️ IMAGE (ALL TYPES)
    if (["thumbnail", "image", "logo", "banner"].includes(field)) {
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (allowed.includes(file.mimetype)) return cb(null, true);
      return cb(new Error("Invalid image type."));
    }

    cb(null, true);
  },
});


// lecture upload
const uploadLectureFiles = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);


//  Course upload
const uploadCourseImage = upload.single("image");


// Channel upload
const uploadChannelImages = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);

module.exports = {
  uploadLectureFiles,
  uploadCourseImage,
  uploadChannelImages,
};