import path from "path";
import multer from "multer";
import fs from "fs";

// ✅ Ensure 'uploads/' folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const name = path.parse(file.originalname).name.replace(/\s+/g, "_");
    const ext = path.extname(file.originalname).toLowerCase(); // normalize extension
    cb(null, `${name}_${Date.now()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = [".jpg", ".jpeg", ".webp", ".png"];
  if (!allowed.includes(ext)) {
    return cb(new Error(`Unsupported file type! ${ext}`), false);
  }
  cb(null, true);
};

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB is better for thumbnails
  storage,
  fileFilter,
});

export default upload;
