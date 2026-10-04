const express = require('express');
const router = express.Router();
const {
    postArticle,
    getArticles,
    getArticlesById,
    updateArticleById,
    deleteArticleById,
} = require('../controllers/article.controller');


// Routes
router.post('/articles', postArticle);

router.get('/articles', getArticles);

router.get('/articles/:id', getArticlesById);

router.put('/articles/:id', updateArticleById);

router.delete('/articles/:id', deleteArticleById);


module.exports = router;