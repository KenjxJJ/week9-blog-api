const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 100,
    },
    content: {
        type: String,
        required: true,
        minLength: 10,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    images: {
        type: [String],
        validate: [
            (val) => val.length <= 5,
            '{PATH} exceeds the maximum limit of 5 images'
        ],
        default: [],
    },
}, {timestamps: true})


module.exports = mongoose.model('Article', ArticleSchema);