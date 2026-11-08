const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage with unique filename and preserved extension
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// File filter restricting to safe image MIME types
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error = new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed.');
        error.status = 400;
        cb(error, false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 3 * 1024 * 1024 // Strict 3MB per-file limit
    },
    fileFilter
});

// Post images middleware: allows up to 5 images under 'images' or 'image' field
const uploadPostImages = (req, res, next) => {
    const multiUpload = upload.fields([
        { name: 'images', maxCount: 5 },
        { name: 'image', maxCount: 5 }
    ]);

    multiUpload(req, res, (err) => {
        if (err) return next(err);

        // Normalize files into req.filesList for easier controller handling
        const imagesField = req.files?.images || [];
        const imageField = req.files?.image || [];
        const combined = [...imagesField, ...imageField];

        if (combined.length > 5) {
            return res.status(400).json({ error: 'Exceeded maximum allowed files. You can upload at most 5 images.' });
        }

        req.filesList = combined;
        next();
    });
};

// Avatar middleware: allows single profile picture under 'avatar' or 'image' field
const uploadAvatar = (req, res, next) => {
    const singleUpload = upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'image', maxCount: 1 }
    ]);

    singleUpload(req, res, (err) => {
        if (err) return next(err);

        const avatarFile = (req.files?.avatar && req.files.avatar[0]) ||
                           (req.files?.image && req.files.image[0]);

        req.avatarFile = avatarFile || null;
        next();
    });
};

module.exports = {
    upload,
    uploadPostImages,
    uploadAvatar,
    uploadDir
};
