const Joi = require('joi');
const ArticleModel = require("../models/article.model");

const postArticle = async (req, res, next) => {
    const articleSchema = Joi.object({
        title: Joi.string().min(5).max(100).required(),
        content: Joi.string().min(10).required(),
        author: Joi.string().optional().default('Public')
    });

    const { error, value } = articleSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const newArticle = new ArticleModel(value);
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
        const { limit = 10, page = 1 } = req.query;
        const skip = (page - 1) + limit;
        const allArticles = await ArticleModel.find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        res.status(200).json(allArticles)

    }
    catch (error) {
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
    const articleSchema = Joi.object({
        title: Joi.string().min(5).max(100).optional(),
        content: Joi.string().min(10).optional(),
        author: Joi.string.optional().default('Public')
    })

    const { error, value } = articleSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const updatedArticle = await ArticleModel.findByIdAndUpdate(
            req.params.id,
            value,
            {
                new: true,
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