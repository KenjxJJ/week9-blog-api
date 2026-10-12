const express = require('express');
const router = express.Router();
const {validateArticle, validateUpdateArticle} = require('../validations/post.validation');
const { authHandler: requireAuth, requireOwnership } = require('../middlewares/authHandler');
const ArticleModel = require('../models/article.model');
const {
    postArticle,
    getArticles,
    getArticlesById,
    updateArticleById,
    deleteArticleById,
} = require('../controllers/article.controller');


// Routes
router.post('/articles', validateArticle,
        requireAuth, postArticle);

router.get('/articles', requireAuth, getArticles);

router.get('/articles/:id', requireAuth, getArticlesById);

router.put('/articles/:id', requireAuth, requireOwnership(ArticleModel), validateUpdateArticle, updateArticleById);

router.delete('/articles/:id', requireAuth, requireOwnership(ArticleModel), deleteArticleById);


module.exports = router;