const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/user.controller');

router.post('/auth/signup', registerUser);

router.post('/auth/login', loginUser);

module.exports = router;
