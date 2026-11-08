const path = require('path');
const fs = require('fs');
const ArticleModel = require("../models/article.model");
const { uploadDir } = require('../middlewares/uploadHandler');

const postArticle = async (req, res, next) => {
    try {
        const { title, content, images } = req.body;
        const newArticle = new ArticleModel({
            title,
            content,
            images: Array.isArray(images) ? images : [],
            author: req.user._id,
        });
        await newArticle.save();

        return res.status(201).json({
            message: 'Article created',
            data: newArticle,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getArticles = async (req, res, next) => {
    try {
        const pageNum = parseInt(req.query.page, 10) || 1;
        const limitNum = parseInt(req.query.limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        const allArticles = await ArticleModel.find({})
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip(skip);

        res.status(200).json(allArticles);
    } catch (error) {
        console.error(error)
        next(error)
    }
};

const getArticlesById = async (req, res, next) => {
    try {
        const article = await ArticleModel.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                message: `Article with ID ${req.params.id} not found`,
            });
        }
        return res.status(200).json({
            message: 'Article found',
            data: article,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const updateArticleById = async (req, res, next) => {
    try {
        const updatedArticle = await ArticleModel.findByIdAndUpdate(
            req.params.id,
            {...req.body},
            {
                returnDocument: 'after',
                runValidators: true,
            }
        );

        if (!updatedArticle) {
            return res.status(404).json({
                message: `Article with ID ${req.params.id} not found`,
            });
        }

        return res.status(200).json({
            message: "Article updated",
            data: updatedArticle,
        });
    } catch (error) {
        console.error({ error });
        next(error);
    }
};

const deleteArticleById = async (req, res, next) => {
    try {
        const articleToRemove = await ArticleModel.findByIdAndDelete(req.params.id);

        if (!articleToRemove) {
            return res.status(404).json({
                message: `Article with ID ${req.params.id} not found`,
            });
        }

        // Clean up attached images from uploads folder if stored locally
        if (Array.isArray(articleToRemove.images) && articleToRemove.images.length > 0) {
            for (const img of articleToRemove.images) {
                try {
                    const filename = path.basename(img);
                    const filePath = path.join(uploadDir, filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                } catch (unlinkErr) {
                    console.error(`Failed to delete image file: ${img}`, unlinkErr.message);
                }
            }
        }

        return res.status(200).json({
            message: `Article ${articleToRemove.title} deleted successfully.`,
            data: articleToRemove,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports = {
    postArticle,
    getArticles,
    getArticlesById,
    updateArticleById,
    deleteArticleById,
};