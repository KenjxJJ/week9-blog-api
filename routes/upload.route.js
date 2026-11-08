const express = require('express');
const router = express.Router();
const { uploadPostImages } = require('../middlewares/uploadHandler');
const { handleFileUpload } = require('../controllers/upload.controller');

// POST /api/upload - Accepts up to 5 images under 'images' or 'image'
router.post('/', uploadPostImages, handleFileUpload);

module.exports = router;
