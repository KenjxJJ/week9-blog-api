const express = require('express');
const router = express.Router();
const { registerUser, loginUser, uploadUserAvatar } = require('../controllers/user.controller');
const { authHandler } = require('../middlewares/authHandler');
const { uploadAvatar } = require('../middlewares/uploadHandler');

router.post('/auth/signup', registerUser);
router.post('/auth/login', loginUser);

// Single profile picture upload (1 Avatar)
router.put('/avatar', authHandler, uploadAvatar, uploadUserAvatar);

module.exports = router;
