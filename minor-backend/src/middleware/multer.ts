import express from 'express';
import multer from 'multer';
import path from 'path';

const app = express();

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, './../uploads');
        console.log('Resolved Upload Path:', uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        console.log('Generated Filename:', `${file.fieldname}-${uniqueSuffix}`);
        cb(null, `${file.fieldname}-${uniqueSuffix}`);
    },
});

// Configure Multer instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
    fileFilter: (req, file, cb) => {
        console.log("File received in Multer:", file);

        if (!file) {
            console.error("No file received!");
            return cb(new Error("No file uploaded!"));
        }

        const allowedFileTypes = /jpeg|jpg|png|gif/;
        const extname = path.extname(file.originalname).toLowerCase();
        const mimetype = file.mimetype;

        console.log(`File details - Name: ${file.originalname}, Ext: ${extname}, MIME: ${mimetype}`);

        if (!allowedFileTypes.test(extname) || !allowedFileTypes.test(mimetype)) {
            console.error("Invalid file type uploaded!");
            return cb(new Error("Only JPEG, JPG, PNG, and GIF files are allowed!"));
        }

        cb(null, true);
    },
});

// Middleware to handle file upload and errors
const handleUpload = (req, res, next) => {
    upload.single('whiteimage')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File too large. Maximum size allowed is 2MB.',
                });
            }
            return res.status(400).json({
                success: false,
                message: 'A file upload error occurred.',
            });
        } else if (err) {
            // Custom errors from fileFilter
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No valid file uploaded.',
            });
        }
        next();
    });
};

export default handleUpload;