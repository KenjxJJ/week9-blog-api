const express = require('express');
const router = express.Router();
const {validateArticle, validateUpdateArticle} = require('../validations/post.validation');
const { authHandler: requireAuth } = require('../middlewares/authHandler');
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

router.put('/articles/:id', validateUpdateArticle, updateArticleById);

router.delete('/articles/:id', requireAuth, deleteArticleById);


module.exports = router;