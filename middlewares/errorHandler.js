const multer = require('multer');

const errorHandler = (err, req, res, next) => {
    console.error(err.message);
    if (process.env.NODE_ENV !== 'production' && err.stack) {
        console.error(err.stack);
    }

    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Enforcing strict 3MB max size per file.' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ error: 'Too many files uploaded or unexpected field name. Max limit is 5 images per post (or 1 for avatar).' });
        }
        return res.status(400).json({ error: err.message });
    }

    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
};

module.exports = errorHandler;
