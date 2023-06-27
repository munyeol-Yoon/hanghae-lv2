const mongoose = require('mongoose');

// 게시글 Schema 작성
const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    postTitle: {
        type: String,
        required: true,
    },
    postContent: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('posts', postSchema);
