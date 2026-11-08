const path = require('path');
const fs = require('fs');
const UserModel = require('../models/user.model');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { uploadDir } = require('../middlewares/uploadHandler');

const registerUser = async (req, res, next) => {
    const registerSchema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        avatar: Joi.string().allow(null, '').optional(),
    });

    const { error } = registerSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const { email, password, name, avatar } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(12);
        const hashed = await bcrypt.hash(password, salt);

        const user = new UserModel({
            email,
            password: hashed,
            name,
            avatar: avatar || null,
        });

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            message: "User registered successfully",
            data: userResponse,
        });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            message: "User logged in successfully",
            token: token,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        next(error);
    }
};

const uploadUserAvatar = async (req, res, next) => {
    try {
        const file = req.avatarFile;
        if (!file) {
            return res.status(400).json({
                error: 'No avatar file uploaded. Please upload a single image using field name "avatar" or "image".'
            });
        }

        const protocol = req.protocol;
        const host = req.get('host');
        const fileUrl = `${protocol}://${host}/uploads/${file.filename}`;

        const user = await UserModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete old avatar from uploads folder if it exists locally
        if (user.avatar) {
            try {
                const oldFilename = path.basename(user.avatar);
                const oldPath = path.join(uploadDir, oldFilename);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            } catch (unlinkErr) {
                console.error(`Failed to delete previous avatar: ${user.avatar}`, unlinkErr.message);
            }
        }

        user.avatar = fileUrl;
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            message: 'Avatar uploaded successfully',
            avatar: fileUrl,
            data: userResponse
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
    uploadUserAvatar,
};
