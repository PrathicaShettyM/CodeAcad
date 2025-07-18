import path from "path";

import multer from "multer";

// file upload middleware using multer
const upload = multer({
    dest: "uploads/",
    limits: {fileSize: 50*1024*1024}, // max limit is 50mb
    storage: multer.diskStorage({
        destination: "uploads/",
        filename: (_req, file, cb) => {
            cb(null, file.originalname);
        },
    }),
    fileFilter: (_req, file, cb) => {
        let ext = path.extname(file.originalname);

        // make sure onlu .jpg, .jpeg, .webp, .png, .mp4
        if (
            ext !== ".jpg" &&
            ext !== ".jpeg" &&
            ext !== ".webp" &&
            ext !== ".png" &&
            ext !== ".mp4" 
        ) {
            cb(new Error(`Unsupported file type! ${ext}`), false);
        }

        cb(null, true);
    },
});

export default upload;