const Joi = require('joi');

const postSchema = Joi.object({
    title: Joi.string().min(5).max(100).required(),
    content: Joi.string().min(10).required(),
    images: Joi.array().items(Joi.string()).max(5).default([]),
});

const updatePostSchema = Joi.object({
    title: Joi.string().min(5).max(100),
    content: Joi.string().min(10),
    images: Joi.array().items(Joi.string()).max(5),
}).min(1);

const validateArticle = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const validateUpdateArticle = (req, res, next) => {
    const { error } = updatePostSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = { validateArticle, validateUpdateArticle };
